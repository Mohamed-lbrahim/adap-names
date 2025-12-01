import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        this.delimiter = delimiter;
        this.assertClassInvariants();
    }

    public clone(): Name {
        this.assertClassInvariants();
        throw new Error("needs implementation or deletion");
    }

    public asString(delimiter: string = this.delimiter): string {
        this.assertClassInvariants();
        IllegalArgumentException.assert(delimiter !== null && delimiter !== undefined, "delimiter must not be null or undefined");
        IllegalArgumentException.assert(delimiter.length === 1, "delimiter must be a single character");
        
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(delimiter);
        
        this.assertClassInvariants();
        return result;
    }

    public toString(): string {
        this.assertClassInvariants();
        const result = this.asDataString();
        this.assertClassInvariants();
        return result;
    }

    public asDataString(): string {
        this.assertClassInvariants();
        const components: string[] = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        const result = components.join(DEFAULT_DELIMITER);
        this.assertClassInvariants();
        return result;
    }

    public isEqual(other: Name): boolean {
        this.assertClassInvariants();
        IllegalArgumentException.assert(other !== null && other !== undefined, "other must not be null or undefined");
        
        if (this.getNoComponents() !== other.getNoComponents()) {
            return false;
        }
        for (let i = 0; i < this.getNoComponents(); i++) {
            if (this.getComponent(i) !== other.getComponent(i)) {
                return false;
            }
        }
        
        this.assertClassInvariants();
        return true;
    }

    public getHashCode(): number {
        this.assertClassInvariants();
        let hashCode: number = 0;
        const s: string = this.asDataString();
        for (let i: number = 0; i < s.length; i++) {
            let c: number = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        this.assertClassInvariants();
        return hashCode;
    }

    public isEmpty(): boolean {
        this.assertClassInvariants();
        const result = this.getNoComponents() === 0;
        this.assertClassInvariants();
        return result;
    }

    public getDelimiterCharacter(): string {
        this.assertClassInvariants();
        this.assertClassInvariants();
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(other !== null && other !== undefined, "other must not be null or undefined");
        
        const oldNoComponents = this.getNoComponents();
        
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
        
        MethodFailedException.assert(this.getNoComponents() === oldNoComponents + other.getNoComponents(), 
            "concat postcondition failed: number of components must equal sum of both names");
        this.assertClassInvariants();
    }

    protected assertClassInvariants(): void {
        InvalidStateException.assert(this.delimiter !== null && this.delimiter !== undefined, 
            "class invariant failed: delimiter must not be null or undefined");
        InvalidStateException.assert(this.delimiter.length === 1, 
            "class invariant failed: delimiter must be a single character");
        InvalidStateException.assert(this.getNoComponents() >= 0, 
            "class invariant failed: number of components must be non-negative");
    }

}