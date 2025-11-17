import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    /** @methodtype initialization-method */
    constructor(source: string, delimiter?: string) {
        if (delimiter !== undefined) {
            this.delimiter = delimiter;
        }
        this.name = source;
        this.noComponents = this.computeNoComponents();
    }

    /** @methodtype helper-method */
    private computeNoComponents(): number {
        if (this.name === "") {
            return 0;
        }
        
        let count = 1; // Start with 1 component
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

    /** @methodtype conversion-method */
    public asString(delimiter: string = this.delimiter): string {
        if (delimiter === this.delimiter) {
            return this.name;
        }
        const components = this.parseComponents();
        return components.join(delimiter);
    }

    /** @methodtype conversion-method */
    public asDataString(): string {
        if (this.delimiter === DEFAULT_DELIMITER) {
            return this.name;
        }
        const components = this.parseComponents();
        return components.join(DEFAULT_DELIMITER);
    }

    /** @methodtype get-method */
    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    /** @methodtype boolean-query-method */
    public isEmpty(): boolean {
        return this.noComponents === 0;
    }

    /** @methodtype get-method */
    public getNoComponents(): number {
        return this.noComponents;
    }

    /** @methodtype get-method */
    public getComponent(x: number): string {
        const components = this.parseComponents();
        return components[x];
    }

    /** @methodtype set-method */
    public setComponent(n: number, c: string): void {
        const components = this.parseComponents();
        components[n] = c;
        this.rebuildName(components);
    }

    /** @methodtype command-method */
    public insert(n: number, c: string): void {
        const components = this.parseComponents();
        components.splice(n, 0, c);
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
    public remove(n: number): void {
        const components = this.parseComponents();
        components.splice(n, 1);
        this.rebuildName(components);
    }

    /** @methodtype command-method */
    public concat(other: Name): void {
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.append(other.getComponent(i));
        }
    }

}