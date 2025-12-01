import { Node } from "./Node";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        IllegalArgumentException.assert(this.state !== FileState.OPEN, "file must not be already open");
        IllegalArgumentException.assert(this.state !== FileState.DELETED, "file must not be deleted");
        // do something
    }

    public read(noBytes: number): Int8Array {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be open");
        IllegalArgumentException.assert(noBytes >= 0, "number of bytes must be non-negative");
        // read something
        return new Int8Array();
    }

    public close(): void {
        IllegalArgumentException.assert(this.state === FileState.OPEN, "file must be open");
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

}