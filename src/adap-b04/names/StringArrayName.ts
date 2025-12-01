import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    /** @methodtype initialization-method */
    constructor(source: string[], delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "source must not be null or undefined");
        for (let i = 0; i < source.length; i++) {
            IllegalArgumentException.assert(source[i] !== null && source[i] !== undefined, 
                "source component must not be null or undefined");
        }
        super(delimiter);
        this.components = [...source];
        this.assertClassInvariants();
    }

    /** @methodtype factory-method */
    public clone(): Name {
        this.assertClassInvariants();
        const result = new StringArrayName(this.components, this.delimiter);
        this.assertClassInvariants();
        return result;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        this.assertClassInvariants();
        const result = this.components.length;
        MethodFailedException.assert(result >= 0, "getNoComponents postcondition failed: result must be non-negative");
        this.assertClassInvariants();
        return result;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index must be less than number of components");
        
        const result = this.components[i];
        
        MethodFailedException.assert(result !== null && result !== undefined, 
            "getComponent postcondition failed: result must not be null or undefined");
        this.assertClassInvariants();
        return result;
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index must be less than number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        this.components[i] = c;
        
        MethodFailedException.assert(this.components[i] === c, 
            "setComponent postcondition failed: component not set correctly");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.getNoComponents(), "index must be less than or equal to number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.components.length;
        this.components.splice(i, 0, c);
        
        MethodFailedException.assert(this.components.length === oldLength + 1, 
            "insert postcondition failed: length must increase by 1");
        MethodFailedException.assert(this.components[i] === c, 
            "insert postcondition failed: component not inserted correctly");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldLength = this.components.length;
        this.components.push(c);
        
        MethodFailedException.assert(this.components.length === oldLength + 1, 
            "append postcondition failed: length must increase by 1");
        MethodFailedException.assert(this.components[this.components.length - 1] === c, 
            "append postcondition failed: component not appended correctly");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index must be less than number of components");
        
        const oldLength = this.components.length;
        this.components.splice(i, 1);
        
        MethodFailedException.assert(this.components.length === oldLength - 1, 
            "remove postcondition failed: length must decrease by 1");
        this.assertClassInvariants();
    }

}