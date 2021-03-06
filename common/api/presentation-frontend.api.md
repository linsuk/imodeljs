## API Report File for "@bentley/presentation-frontend"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { BeEvent } from '@bentley/bentleyjs-core';
import { Content } from '@bentley/presentation-common';
import { ContentRequestOptions } from '@bentley/presentation-common';
import { ContentResponse } from '@bentley/presentation-common';
import { Descriptor } from '@bentley/presentation-common';
import { DescriptorOverrides } from '@bentley/presentation-common';
import { HierarchyRequestOptions } from '@bentley/presentation-common';
import { I18N } from '@bentley/imodeljs-i18n';
import { IClientStateHolder } from '@bentley/presentation-common';
import { Id64Arg } from '@bentley/bentleyjs-core';
import { Id64String } from '@bentley/bentleyjs-core';
import { IDisposable } from '@bentley/bentleyjs-core';
import { IModelConnection } from '@bentley/imodeljs-frontend';
import { InstanceKey } from '@bentley/presentation-common';
import { Keys } from '@bentley/presentation-common';
import { KeySet } from '@bentley/presentation-common';
import { LabelRequestOptions } from '@bentley/presentation-common';
import { Node } from '@bentley/presentation-common';
import { NodeKey } from '@bentley/presentation-common';
import { NodePathElement } from '@bentley/presentation-common';
import { NodesResponse } from '@bentley/presentation-common';
import { Paged } from '@bentley/presentation-common';
import { PersistentKeysContainer } from '@bentley/presentation-common';
import { RegisteredRuleset } from '@bentley/presentation-common';
import { RpcRequestsHandler } from '@bentley/presentation-common';
import { Ruleset } from '@bentley/presentation-common';
import { RulesetManagerState } from '@bentley/presentation-common';
import { RulesetVariablesState } from '@bentley/presentation-common';
import { SelectionInfo } from '@bentley/presentation-common';
import { SelectionScope } from '@bentley/presentation-common';

// Warning: (ae-missing-release-tag) "ISelectionProvider" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export interface ISelectionProvider {
    getSelection(imodel: IModelConnection, level: number): Readonly<KeySet>;
    selectionChange: SelectionChangeEvent;
}

// Warning: (ae-missing-release-tag) "PersistenceHelper" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class PersistenceHelper {
    static createKeySet(imodel: IModelConnection, container: PersistentKeysContainer): Promise<KeySet>;
    static createPersistentKeysContainer(imodel: IModelConnection, keyset: KeySet): Promise<PersistentKeysContainer>;
}

// Warning: (ae-missing-release-tag) "Presentation" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class Presentation {
    // (undocumented)
    static i18n: I18N;
    // Warning: (ae-forgotten-export) The symbol "Props" needs to be exported by the entry point presentation-frontend.d.ts
    static initialize(props?: Props): void;
    // (undocumented)
    static presentation: PresentationManager;
    // (undocumented)
    static selection: SelectionManager;
    static terminate(): void;
}

// Warning: (ae-missing-release-tag) "PresentationManager" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class PresentationManager implements IDisposable {
    activeLocale: string | undefined;
    static create(props?: Props): PresentationManager;
    // (undocumented)
    dispose(): void;
    getContent(requestOptions: Paged<ContentRequestOptions<IModelConnection>>, descriptorOrOverrides: Descriptor | DescriptorOverrides, keys: KeySet): Promise<Content | undefined>;
    getContentAndSize(requestOptions: Paged<ContentRequestOptions<IModelConnection>>, descriptorOrOverrides: Descriptor | DescriptorOverrides, keys: KeySet): Promise<ContentResponse>;
    getContentDescriptor(requestOptions: ContentRequestOptions<IModelConnection>, displayType: string, keys: KeySet, selection: SelectionInfo | undefined): Promise<Descriptor | undefined>;
    getContentSetSize(requestOptions: ContentRequestOptions<IModelConnection>, descriptorOrOverrides: Descriptor | DescriptorOverrides, keys: KeySet): Promise<number>;
    getDisplayLabel(requestOptions: LabelRequestOptions<IModelConnection>, key: InstanceKey): Promise<string>;
    getDisplayLabels(requestOptions: LabelRequestOptions<IModelConnection>, keys: InstanceKey[]): Promise<string[]>;
    getDistinctValues(requestOptions: ContentRequestOptions<IModelConnection>, descriptor: Descriptor, keys: KeySet, fieldName: string, maximumValueCount?: number): Promise<string[]>;
    getFilteredNodePaths(requestOptions: HierarchyRequestOptions<IModelConnection>, filterText: string): Promise<NodePathElement[]>;
    getNodePaths(requestOptions: HierarchyRequestOptions<IModelConnection>, paths: InstanceKey[][], markedIndex: number): Promise<NodePathElement[]>;
    getNodes(requestOptions: Paged<HierarchyRequestOptions<IModelConnection>>, parentKey?: NodeKey): Promise<Node[]>;
    getNodesAndCount(requestOptions: Paged<HierarchyRequestOptions<IModelConnection>>, parentKey?: NodeKey): Promise<NodesResponse>;
    getNodesCount(requestOptions: HierarchyRequestOptions<IModelConnection>, parentKey?: NodeKey): Promise<number>;
    // (undocumented)
    readonly rpcRequestsHandler: RpcRequestsHandler;
    // Warning: (ae-forgotten-export) The symbol "RulesetManager" needs to be exported by the entry point presentation-frontend.d.ts
    rulesets(): RulesetManager;
    vars(rulesetId: string): RulesetVariablesManager;
}

// Warning: (ae-missing-release-tag) "RulesetVariablesManager" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public (undocumented)
export class RulesetVariablesManager implements IClientStateHolder<RulesetVariablesState> {
    constructor(rulesetId: string);
    getBool(variableId: string): Promise<boolean>;
    getId64(variableId: string): Promise<Id64String>;
    getId64s(variableId: string): Promise<Id64String[]>;
    getInt(variableId: string): Promise<number>;
    getInts(variableId: string): Promise<number[]>;
    getString(variableId: string): Promise<string>;
    // (undocumented)
    key: string;
    // (undocumented)
    onStateChanged: BeEvent<() => void>;
    setBool(variableId: string, value: boolean): Promise<void>;
    setId64(variableId: string, value: Id64String): Promise<void>;
    setId64s(variableId: string, value: Id64String[]): Promise<void>;
    setInt(variableId: string, value: number): Promise<void>;
    setInts(variableId: string, value: number[]): Promise<void>;
    setString(variableId: string, value: string): Promise<void>;
    // (undocumented)
    readonly state: RulesetVariablesState;
}

// Warning: (ae-missing-release-tag) "SelectionChangeEvent" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class SelectionChangeEvent extends BeEvent<SelectionChangesListener> {
}

// Warning: (ae-missing-release-tag) "SelectionChangeEventArgs" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export interface SelectionChangeEventArgs {
    changeType: SelectionChangeType;
    imodel: IModelConnection;
    keys: Readonly<KeySet>;
    level: number;
    rulesetId?: string;
    source: string;
    timestamp: Date;
}

// Warning: (ae-missing-release-tag) "SelectionChangesListener" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export type SelectionChangesListener = (args: SelectionChangeEventArgs, provider: ISelectionProvider) => void;

// Warning: (ae-missing-release-tag) "SelectionChangeType" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export enum SelectionChangeType {
    Add = 0,
    Clear = 3,
    Remove = 1,
    Replace = 2
}

// Warning: (ae-missing-release-tag) "SelectionHandler" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class SelectionHandler implements IDisposable {
    constructor(manager: SelectionManager, name: string, imodel: IModelConnection, rulesetId?: string, onSelect?: SelectionChangesListener);
    addToSelection(keys: Keys, level?: number): void;
    clearSelection(level?: number): void;
    dispose(): void;
    getSelection(level?: number): Readonly<KeySet>;
    getSelectionLevels(): number[];
    // (undocumented)
    imodel: IModelConnection;
    // (undocumented)
    readonly manager: SelectionManager;
    // (undocumented)
    name: string;
    // (undocumented)
    onSelect?: SelectionChangesListener;
    protected onSelectionChanged: (evt: SelectionChangeEventArgs, provider: ISelectionProvider) => void;
    removeFromSelection(keys: Keys, level?: number): void;
    replaceSelection(keys: Keys, level?: number): void;
    // (undocumented)
    rulesetId?: string;
    protected shouldHandle(evt: SelectionChangeEventArgs): boolean;
}

// Warning: (ae-missing-release-tag) "SelectionManager" is exported by the package, but it is missing a release tag (@alpha, @beta, @public, or @internal)
// 
// @public
export class SelectionManager implements ISelectionProvider {
    // Warning: (ae-forgotten-export) The symbol "SelectionManagerProps" needs to be exported by the entry point presentation-frontend.d.ts
    constructor(props: SelectionManagerProps);
    addToSelection(source: string, imodel: IModelConnection, keys: Keys, level?: number, rulesetId?: string): void;
    addToSelectionWithScope(source: string, imodel: IModelConnection, ids: Id64Arg, scope: SelectionScope | string, level?: number, rulesetId?: string): Promise<void>;
    clearSelection(source: string, imodel: IModelConnection, level?: number, rulesetId?: string): void;
    getSelection(imodel: IModelConnection, level?: number): Readonly<KeySet>;
    getSelectionLevels(imodel: IModelConnection): number[];
    removeFromSelection(source: string, imodel: IModelConnection, keys: Keys, level?: number, rulesetId?: string): void;
    removeFromSelectionWithScope(source: string, imodel: IModelConnection, ids: Id64Arg, scope: SelectionScope | string, level?: number, rulesetId?: string): Promise<void>;
    replaceSelection(source: string, imodel: IModelConnection, keys: Keys, level?: number, rulesetId?: string): void;
    replaceSelectionWithScope(source: string, imodel: IModelConnection, ids: Id64Arg, scope: SelectionScope | string, level?: number, rulesetId?: string): Promise<void>;
    // Warning: (ae-forgotten-export) The symbol "SelectionScopesManager" needs to be exported by the entry point presentation-frontend.d.ts
    readonly scopes: SelectionScopesManager;
    readonly selectionChange: SelectionChangeEvent;
    setSyncWithIModelToolSelection(imodel: IModelConnection, sync?: boolean): void;
}


// (No @packageDocumentation comment for this package)

```
