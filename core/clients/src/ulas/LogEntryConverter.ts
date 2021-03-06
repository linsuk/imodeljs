/*---------------------------------------------------------------------------------------------
* Copyright (c) 2019 Bentley Systems, Incorporated. All rights reserved.
* Licensed under the MIT License. See LICENSE.md in the project root for license terms.
*--------------------------------------------------------------------------------------------*/
import { Guid, GuidString, Logger } from "@bentley/bentleyjs-core";
import { UsageLogEntry, FeatureLogEntry, FeatureStartedLogEntry, FeatureEndedLogEntry, ProductVersion, UsageType } from "./UlasClient";
import { AuthorizedClientRequestContext } from "../AuthorizedClientRequestContext";
import { UserInfo } from "../UserInfo";
import { ClientsLoggerCategory } from "../ClientsLoggerCategory";

const loggerCategory: string = ClientsLoggerCategory.UlasClient;

/** Specifies the JSON format for a UsageLogEntry as expected by the ULAS REST API
 * (see https://qa-connect-ulastm.bentley.com/Bentley.ULAS.SwaggerUI/SwaggerWebApp/?urls.primaryName=ULAS%20Posting%20Service%20v1)
 * @internal
 */
export interface UsageLogEntryJson {
  /** Ultimate ID, i.e. company ID in SAP */
  ultID: number | undefined;
  /** The ID of the Principal that was granted access to the application */
  pid: GuidString | undefined;
  /** The GUID of the IMS user accessing the product, maybe the same as the Principal. */
  imsID: GuidString | undefined;
  /** The client’s machine name excluding domain information. */
  hID: string;
  /** The client’s login name excluding domain information */
  uID: string | undefined;
  /** The GUID embedded in the policy file that allows us to track the entitlement history. */
  polID: GuidString;
  /** The ID of the securable. */
  secID: string;
  /** The product ID for which usage is being submitted. It is a 4-digit Product ID from the GPR. */
  prdid: number | undefined;
  /** A feature string further identifying the product for which available usage is being submitted. Not to be confused with feature IDs. */
  fstr: string;
  /** The version of the application producing the usage.
   *  Format: Pad all sections out to 4 digits padding is with zeros, e.g. 9.10.2.113 becomes 9001000020113.
   */
  ver: number | undefined;
  /** The GUID of the project that the usage should be associated with.
   *  If no project is selected, omit the field.
   */
  projID: GuidString | undefined;
  /** The GUID that identifies a unique usage session, used to correlate data between feature usage and usage logs. */
  corID: GuidString;
  /** The UTC time of the event. */
  evTimeZ: string;
  /** The version of the schema which this log entry represents. */
  lVer: number;
  /** Identifies the source of the usage log entry: RealTime, Offline, Checkout */
  lSrc: string;
  /** Identifies the country where the client reporting the usage belongs to. */
  country: string | undefined;
  /** The type of usage that occurred on the client. It is acting as a filter to eliminate records from log processing that
   *  should not count towards a customer’s peak processing. One of: Production, Trial, Beta, HomeUse, PreActivation
   */
  uType: string;
}

/** @internal */
export interface FeatureLogEntryAttributeJson {
  name: string;
  value: string;
}

/** Specifies the JSON format for a FeatureLogEntry as expected by the ULAS REST API
 * (see https://qa-connect-ulastm.bentley.com/Bentley.ULAS.SwaggerUI/SwaggerWebApp/?urls.primaryName=ULAS%20Posting%20Service%20v1)
 * @internal
 */
export interface FeatureLogEntryJson extends UsageLogEntryJson {
  /** Gets the ID of the feature used (from the Global Feature Registry) */
  ftrID: GuidString;
  /** The start date in UTC when feature usage has started (for duration feature log entries) */
  sDateZ: string;
  /** The end date in UTC when feature usage has started (for duration feature log entries) */
  eDateZ: string;
  /** Additional user-defined metadata for the feature usage */
  uData: FeatureLogEntryAttributeJson[];
}

/** @internal */
export class LogEntryConverter {
  // for now this is always 1
  private static readonly _logEntryVersion: number = 1;
  // this is a real-time client, i.e. it sends the requests right away without caching or aggregating.
  private static readonly _logPostingSource: string = "RealTime";
  // fStr argument is empty for now
  private static readonly _featureString: string = "";
  private static readonly _policyFileId: GuidString = Guid.createValue();
  private static readonly _securableId: string = Guid.createValue();

  /**
   * Extracts the application version from the supplied request context
   * @param requestContext The client request context
   * @returns The application version for the request context
   */
  private static getApplicationVersion(requestContext: AuthorizedClientRequestContext): ProductVersion {
    const applicationVersion = requestContext.applicationVersion;
    const defaultVersion = { major: 1, minor: 0 };
    if (!applicationVersion) {
      Logger.logWarning(loggerCategory, "ApplicationVersion was not specified. Set up IModelApp.applicationVersion for frontend applications, or IModelHost.applicationVersion for agents", () => ({ applicationVersion }));
      return defaultVersion;
    }

    const versionSplit = applicationVersion.split(".");
    const length = versionSplit.length;
    if (length < 2) {
      Logger.logWarning(loggerCategory, "ApplicationVersion is not valid", () => ({ applicationVersion }));
      return defaultVersion;
    }

    const major = parseInt(versionSplit[0], 10);
    if (typeof major === "undefined") {
      Logger.logWarning(loggerCategory, "ApplicationVersion is not valid", () => ({ applicationVersion }));
      return defaultVersion;
    }

    const minor = parseInt(versionSplit[1], 10);
    if (typeof minor === "undefined") {
      Logger.logWarning(loggerCategory, "ApplicationVersion is not valid", () => ({ applicationVersion }));
      return { major, minor: 0 };
    }

    let sub1: number | undefined;
    let sub2: number | undefined;
    if (length > 2) {
      sub1 = parseInt(versionSplit[2], 10) || undefined;
      if (length > 3 && sub1) {
        sub2 = parseInt(versionSplit[3], 10) || undefined;
      }
    }

    return { major, minor, sub1, sub2 };
  }

  /**
   * Extracts the application id from the supplied request context
   * @param requestContext The client request context
   * @returns The application id for the request context
   */
  private static getApplicationId(requestContext: AuthorizedClientRequestContext): number {
    const defaultId = 2686; // iModel.js
    if (!requestContext.applicationId) {
      Logger.logWarning(loggerCategory, "ApplicationId was not specified. Set up IModelApp.applicationId for frontend applications, or IModelHost.applicationId for agents");
      return defaultId;
    }

    return parseInt(requestContext.applicationId, 10) || defaultId;
  }

  /**
   * Extracts the session id from the supplied request context
   * @param requestContext The client request context
   * @returns The session id for the request context
   */
  private static getSessionId(requestContext: AuthorizedClientRequestContext): GuidString {
    const defaultId = "00000000-0000-0000-0000-000000000000";
    if (!requestContext.sessionId) {
      Logger.logWarning(loggerCategory, "SessionId was not specified. Set up IModelApp.sessionId for frontend applications, or IModelHost.sessionId for agents");
      return defaultId;
    }

    return requestContext.sessionId || defaultId;
  }

  public static toUsageLogJson(requestContext: AuthorizedClientRequestContext, entry: UsageLogEntry): UsageLogEntryJson {
    const productId: number = LogEntryConverter.getApplicationId(requestContext);
    const productVersion: ProductVersion = LogEntryConverter.getApplicationVersion(requestContext);
    const sessionId: GuidString = LogEntryConverter.getSessionId(requestContext);

    const userInfo: UserInfo | undefined = requestContext.accessToken.getUserInfo();
    const featureTrackingInfo = userInfo ? userInfo.featureTracking : undefined;

    const imsID: GuidString | undefined = !!userInfo ? userInfo.id : undefined;
    const ultID: number | undefined = !!featureTrackingInfo ? parseInt(featureTrackingInfo.ultimateSite, 10) : undefined;
    const usageCountry: string | undefined = !!featureTrackingInfo ? featureTrackingInfo.usageCountryIso : undefined;

    const hID: string = LogEntryConverter.prepareMachineName(entry.hostName);
    const hostUserName = userInfo && userInfo.email ? userInfo.email.id : undefined;
    const uID: string | undefined = !!hostUserName ? LogEntryConverter.prepareUserName(hostUserName, entry.hostName) : imsID;

    const ver: number | undefined = LogEntryConverter.toVersionNumber(productVersion);
    const uType: string = LogEntryConverter.usageTypeToString(entry.usageType);

    return {
      ultID, pid: imsID, // Principal ID for now is IMS Id (eventually should be pulled from policy files)
      imsID, hID, uID, polID: LogEntryConverter._policyFileId, secID: LogEntryConverter._securableId, prdid: productId,
      fstr: LogEntryConverter._featureString, ver, projID: entry.projectId, corID: sessionId,
      evTimeZ: entry.timestamp, lVer: LogEntryConverter._logEntryVersion, lSrc: LogEntryConverter._logPostingSource,
      country: usageCountry, uType,
    };
  }

  public static toFeatureLogJson(requestContext: AuthorizedClientRequestContext, entries: FeatureLogEntry[]): FeatureLogEntryJson[] {
    const json: FeatureLogEntryJson[] = [];
    const productId: number = LogEntryConverter.getApplicationId(requestContext);
    const productVersion: ProductVersion = LogEntryConverter.getApplicationVersion(requestContext);
    const sessionId: GuidString = LogEntryConverter.getSessionId(requestContext);

    const userInfo: UserInfo | undefined = requestContext.accessToken.getUserInfo();
    const featureTrackingInfo = userInfo ? userInfo.featureTracking : undefined;

    const imsID: GuidString | undefined = !!userInfo ? userInfo.id : undefined;
    const ultID: number | undefined = !!featureTrackingInfo ? parseInt(featureTrackingInfo.ultimateSite, 10) : undefined;
    const usageCountry: string | undefined = !!featureTrackingInfo ? featureTrackingInfo.usageCountryIso : undefined;
    const hostUserName = userInfo && userInfo.email ? userInfo.email.id : undefined;
    const ver: number | undefined = LogEntryConverter.toVersionNumber(productVersion);

    for (const entry of entries) {
      const hID: string = LogEntryConverter.prepareMachineName(entry.hostName);
      const uID: string | undefined = !!hostUserName ? LogEntryConverter.prepareUserName(hostUserName, entry.hostName) : imsID;

      const evTimeZ: string = entry.timestamp;
      let sDateZ: string;
      let eDateZ: string;
      let corID: GuidString;
      const startEntry: FeatureStartedLogEntry = entry as FeatureStartedLogEntry;
      const endEntry: FeatureEndedLogEntry = entry as FeatureEndedLogEntry;
      const defaultDate: string = "0001-01-01T00:00:00Z";
      if (!!startEntry.entryId) {
        sDateZ = evTimeZ;
        eDateZ = defaultDate;
        corID = startEntry.entryId;
      } else if (!!endEntry.startEntryId) {
        sDateZ = defaultDate;
        eDateZ = evTimeZ;
        corID = endEntry.startEntryId;
      } else {
        sDateZ = evTimeZ;
        eDateZ = evTimeZ;
        corID = sessionId;
      }

      const uType: string = LogEntryConverter.usageTypeToString(entry.usageType);

      const uData: FeatureLogEntryAttributeJson[] = [];
      for (const att of entry.usageData) {
        uData.push({ name: att.name, value: att.value.toString() });
      }

      const entryJson: FeatureLogEntryJson = {
        ultID, pid: imsID, // Principal ID for now is IMS Id (eventually should be pulled from policy files)
        imsID, hID, uID, polID: LogEntryConverter._policyFileId, secID: LogEntryConverter._securableId,
        prdid: productId, fstr: LogEntryConverter._featureString, ver, projID: entry.projectId, corID,
        evTimeZ, lVer: LogEntryConverter._logEntryVersion, lSrc: LogEntryConverter._logPostingSource,
        country: usageCountry, uType, ftrID: entry.featureId, sDateZ, eDateZ, uData,
      };

      json.push(entryJson);
    }
    return json;
  }

  private static toVersionNumber(version?: ProductVersion): number | undefined {
    if (!version)
      return undefined;

    // version must be encoded into a single number where each version digit is padded out to 4 digits
    // and the version is always considered to have 4 digits.
    // Ex: 3.99.4 -> 3.99.4.0 -> 3009900040000
    let verNumber: number = !!version.sub2 ? version.sub2 : 0;
    verNumber += 10000 * (!!version.sub1 ? version.sub1 : 0);
    verNumber += Math.pow(10000, 2) * version.minor;
    verNumber += Math.pow(10000, 3) * version.major;
    return verNumber;
  }

  private static prepareMachineName(machineName: string): string {
    if (!machineName || machineName.length === 0)
      return "";

    if (machineName === "::1" || machineName === "127.0.0.1")
      return "localhost";

    return machineName.toLowerCase();
  }

  private static prepareUserName(userName: string, machineName: string): string {
    if (!userName || userName.length === 0)
      return "";

    let preparedUserName: string = userName;

    const backslashPos: number = userName.indexOf("\\");
    if (backslashPos >= 0)
      preparedUserName = userName.substr(backslashPos + 1);
    else {
      const slashPos: number = userName.indexOf("/");
      if (slashPos >= 0)
        preparedUserName = userName.substr(slashPos + 1);
    }

    preparedUserName = preparedUserName.toLowerCase();
    if (!!machineName && machineName.length > 0 && (preparedUserName.includes("administrator") || preparedUserName.includes("system")))
      preparedUserName = `${machineName.toLowerCase()}\\${preparedUserName}`;

    return preparedUserName;
  }

  private static usageTypeToString(val: UsageType): string {
    switch (val) {
      case UsageType.Beta:
        return "Beta";
      case UsageType.HomeUse:
        return "HomeUse";
      case UsageType.PreActivation:
        return "PreActivation";
      case UsageType.Production:
        return "Production";
      case UsageType.Trial:
        return "Trial";
      default:
        throw new Error("Unhandled UsageType enum value");
    }
  }
}
