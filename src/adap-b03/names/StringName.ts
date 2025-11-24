import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    /** @methodtype initialization-method */
    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        this.noComponents = this.computeNoComponents();
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
        this.name = components.join(this.delimiter);
        this.noComponents = components.length;
    }

    /** @methodtype factory-method */
    public clone(): Name {
        return new StringName(this.name, this.delimiter);
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** @methodtype get-method */
    public getComponent(i: number): string {
        const components = this.parseComponents();
        return components[i];
    }

    /** @methodtype set-method */
    public setComponent(i: number, c: string): void {
        const components = this.parseComponents();
        components[i] = c;
        this.rebuildName(components);
    }

    /** @methodtype command-method */
    public insert(i: number, c: string): void {
        const components = this.parseComponents();
        components.splice(i, 0, c);
        this.rebuildName(components);
    }

    /** @methodtype command-method */
    public append(c: string): void {
        if (this.name === "") {
            this.name = c;
        } else {
            this.name += this.delimiter + c;
        }
        this.noComponents++;
    }

    /** @methodtype command-method */
    public remove(i: number): void {
        const components = this.parseComponents();
        components.splice(i, 1);
        this.rebuildName(components);
    }

}