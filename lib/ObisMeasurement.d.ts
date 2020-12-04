export declare class ObisMeasurement {
    medium: number;
    channel: number;
    measurement: number;
    measureType: number;
    tariffRate: number;
    previousMeasurement: number;
    values: {
        value: number;
        unit: string;
    }[];

    /**
     * @param content full = return with set values, base = ignore medium and channel, extended = also include previousMeasurement
     */
    idToString(content?: 'full' | 'base' | 'extended'): string;

    valueToString(): string;
}
