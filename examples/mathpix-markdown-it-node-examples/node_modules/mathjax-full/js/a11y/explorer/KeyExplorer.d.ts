import { A11yDocument, Region } from './Region.js';
import { Explorer, AbstractExplorer } from './Explorer.js';
export interface KeyExplorer extends Explorer {
    KeyDown(event: KeyboardEvent): void;
    FocusIn(event: FocusEvent): void;
    FocusOut(event: FocusEvent): void;
}
export declare abstract class AbstractKeyExplorer<T> extends AbstractExplorer<T> implements KeyExplorer {
    protected walker: sre.Walker;
    protected events: [string, (x: Event) => void][];
    private oldIndex;
    abstract KeyDown(event: KeyboardEvent): void;
    FocusIn(event: FocusEvent): void;
    FocusOut(event: FocusEvent): void;
    Update(force?: boolean): void;
    Attach(): void;
    Detach(): void;
    Stop(): void;
}
export declare class SpeechExplorer extends AbstractKeyExplorer<string> {
    document: A11yDocument;
    protected region: Region<string>;
    protected node: HTMLElement;
    private mml;
    speechGenerator: sre.SpeechGenerator;
    showRegion: string;
    private init;
    private restarted;
    constructor(document: A11yDocument, region: Region<string>, node: HTMLElement, mml: HTMLElement);
    Start(): void;
    Update(force?: boolean): void;
    Speech(walker: sre.Walker): void;
    KeyDown(event: KeyboardEvent): void;
    Move(key: number): void;
    private initWalker;
    private getOptions;
}
export declare class Magnifier extends AbstractKeyExplorer<HTMLElement> {
    document: A11yDocument;
    protected region: Region<HTMLElement>;
    protected node: HTMLElement;
    private mml;
    constructor(document: A11yDocument, region: Region<HTMLElement>, node: HTMLElement, mml: HTMLElement);
    Update(force?: boolean): void;
    Start(): void;
    private showFocus;
    Move(key: number): void;
    KeyDown(event: KeyboardEvent): void;
}
