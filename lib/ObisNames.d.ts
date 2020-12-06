import {ObisLanguage, ObisMeasurement} from '..';

interface ObisMeasurementNames {
    mediumName: string;
    channelName: string;
    measurementName: string;
    measurementTypeName: string;
    tariffRateName: string;
    previousMeasurementName: string;
    customName: string;
    obisName: string;
}

export function resolveObisName(obisObj: ObisMeasurement, language: ObisLanguage): ObisMeasurementNames;
