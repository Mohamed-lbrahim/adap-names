import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    /** @methodtype initialization-method */
    constructor(source: string, delimiter?: string) {
        IllegalArgumentException.assert(source !== null && source !== undefined, "source must not be null or undefined");
        super(delimiter);
        this.name = source;
        this.noComponents = this.computeNoComponents();
        this.assertClassInvariants();
    }

    /** @methodtype helper-method */
    private computeNoComponents(): number {
        if (this.name === "") {
            return 0;
        }
        
        let count = 1;
        let i = 0;
        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER) {
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                count++;
                i++;
            } else {
                i++;
            }
        }
        return count;
    }

    /** @methodtype helper-method */
    private parseComponents(): string[] {
        if (this.name === "") {
            return [];
        }

        const components: string[] = [];
        let currentComponent = "";
        let i = 0;

        while (i < this.name.length) {
            if (this.name[i] === ESCAPE_CHARACTER && i + 1 < this.name.length) {
                currentComponent += this.name[i] + this.name[i + 1];
                i += 2;
            } else if (this.name[i] === this.delimiter) {
                components.push(currentComponent);
                currentComponent = "";
                i++;
            } else {
                currentComponent += this.name[i];
                i++;
            }
        }
        components.push(currentComponent);
        return components;
    }

    /** @methodtype helper-method */
    private rebuildName(components: string[]): void {
        IllegalArgumentException.assert(components !== null && components !== undefined, 
            "components must not be null or undefined");
        for (let i = 0; i < components.length; i++) {
            IllegalArgumentException.assert(components[i] !== null && components[i] !== undefined, 
                "component must not be null or undefined");
        }
        
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
        
        InvalidStateException.assert(this.noComponents === this.computeNoComponents(), 
            "class invariant failed: noComponents must match computed value");
    }

    /** @methodtype factory-method */
    public clone(): Name {
        this.assertClassInvariants();
        const result = new StringName(this.name, this.delimiter);
        this.assertClassInvariants();
        return result;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        this.assertClassInvariants();
        MethodFailedException.assert(this.noComponents >= 0, 
            "getNoComponents postcondition failed: result must be non-negative");
        this.assertClassInvariants();
        return this.noComponents;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index must be less than number of components");
        
        const components = this.parseComponents();
        const result = components[i];
        
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
        
        const components = this.parseComponents();
        components[i] = c;
        this.rebuildName(components);
        
        MethodFailedException.assert(this.getComponent(i) === c, 
            "setComponent postcondition failed: component not set correctly");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i <= this.getNoComponents(), "index must be less than or equal to number of components");
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldNoComponents = this.noComponents;
        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.rebuildName(components);
        
        MethodFailedException.assert(this.noComponents === oldNoComponents + 1, 
            "insert postcondition failed: number of components must increase by 1");
        MethodFailedException.assert(this.getComponent(i) === c, 
            "insert postcondition failed: component not inserted correctly");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public append(c: string): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(c !== null && c !== undefined, "component must not be null or undefined");
        
        const oldNoComponents = this.noComponents;
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
        
        MethodFailedException.assert(this.noComponents === oldNoComponents + 1, 
            "append postcondition failed: number of components must increase by 1");
        InvalidStateException.assert(this.noComponents === this.computeNoComponents(), 
            "class invariant failed: noComponents must match computed value");
        this.assertClassInvariants();
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        this.assertClassInvariants();
        IllegalArgumentException.assert(i >= 0, "index must be non-negative");
        IllegalArgumentException.assert(i < this.getNoComponents(), "index must be less than number of components");
        
        const oldNoComponents = this.noComponents;
        const components = this.parseComponents();
        components.splice(i, 1);
        this.rebuildName(components);
        
        MethodFailedException.assert(this.noComponents === oldNoComponents - 1, 
            "remove postcondition failed: number of components must decrease by 1");
        this.assertClassInvariants();
    }

    protected assertClassInvariants(): void {
        super.assertClassInvariants();
        InvalidStateException.assert(this.name !== null && this.name !== undefined, 
            "class invariant failed: name must not be null or undefined");
        InvalidStateException.assert(this.noComponents === this.computeNoComponents(), 
            "class invariant failed: noComponents must match computed value");
    }

}