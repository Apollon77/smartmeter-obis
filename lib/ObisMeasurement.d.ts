export declare class ObisMeasurement {
    medium: number;
    channel: number;
    measurement: number;
    measureType: number;
    tariffRate: number;
    previousMeasurement: number;

    rawValue?: string;
    values: ObisValue[];

    /**
     * @param content full = return with set values, base = ignore medium and channel, extended = also include previousMeasurement
     */
    idToString(content?: 'full' | 'base' | 'extended'): string;

    valueToString(): string;

    getMedium(): number;

    getChannel(): number;

    getMeasurement(): number;

    getMeasureType(): number;

    getTariffRate(): number;

    getPreviousMeasurement(): number;

    getRawValue(): string | undefined;

    getValues(): ObisValue[];

    getValueLength(): number;

    getValue(index: number): ObisValue | undefined;
}

interface ObisValue {
    value: number;
    unit: string;
}
