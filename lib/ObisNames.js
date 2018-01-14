/* jshint -W097 */
// jshint strict:true
/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

const obisMedium = {
    'en': {
    	0:  'Abstract',
    	1:  'Electricity',
    	4:  'Heat cost Allocator',
    	5:  'Cooling',
    	6:  'Heat',
    	7:  'Gas',
    	8:  'Cold water',
    	9:  'Hot water',
        16: 'Oil',
        17: 'Compressed air',
        18: 'Nitrogen'
    },
    'de': {
        0:  'Abstrakt',
        1:  'Strom',
        4:  'Heizkostenverteiler',
        5:  'Kälte',
        6:  'Wärme',
        7:  'Gas',
        8:  'Kaltwasser',
        9:  'Warmwasser',
        16: 'Öl',
        17: 'Druckluft',
        18: 'Stickstoff'
    }
};

const obisChannel = {
    'en': {
        // 1-127: Device individual channel
        128: 'Savings',
        129: 'Setvalue',
        130: 'Prediction',
        131: 'Working day max',
        132: 'Holiday max.',
        133: 'Working day min.',
        134: 'Holiday min.',
        135: 'SLP Monday',
        136: 'SLP Tuesday',
        137: 'SLP Wednesday',
        138: 'SLP Thursday',
        139: 'SLP Friday',
        140: 'SLP Saturday',
        141: 'SLP Working day',
        142: 'SLP Holiday',
        143: 'Currency',
        144: 'Currency prediction',
        145: 'CO2',
        146: 'CO2 Prediction'
    },
    'de': {
        // 1-127: Messgerätespezifischer Kanal
        128: 'Einsparung',
        129: 'Sollwert',
        130: 'Prognose',
        131: 'Maximale Grenzwerte Arbeitstag',
        132: 'Maximale Grenzwerte Nichtarbeitstag',
        133: 'Minimale Grenzwerte Arbeitstag',
        134: 'Minimale Grenzwerte Nichtarbeitstag',
        135: 'SLP Montag',
        136: 'SLP Dienstag',
        137: 'SLP Mittwoch',
        138: 'SLP Donnerstag',
        139: 'SLP Freitag',
        140: 'SLP Samstag',
        141: 'SLP Arbeitstag',
        142: 'SLP Nichtarbeitstag',
        143: 'Geldbetrag',
        144: 'Prognose Geldbetrag',
        145: 'Emmision CO2',
        146: 'Prognose Emmision CO2'
    }
};

const obisMeasurement = {
    0: { // Abstract Objects
        'en': {
        	128: 'Temperature',
            129: 'Status',
        	130: 'Humidity',
            131: 'Light Intensity',
            132: 'Operating Hours',
            133: 'Units',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
        	128: 'Temperatur',
            129: 'Status',
        	130: 'Feuchte',
            131: 'Lichtstärke',
            132: 'Betriebsstunden',
            133: 'Stückzahl',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    },
    1: { // Electricity
        'en': {
            0:  'General purpose',
            1:  'Sum active power +',
            2:  'Sum active power -',
            3:  'Sum reactive power +',
            4:  'Sum reactive power -',
            5:  'Sum reactive power Q I',
            6:  'Sum reactive power Q II',
            7:  'Sum reactive power Q III',
            8:  'Sum reactive power Q IV',
            9:  'Sum apparent power +',
            10: 'Sum apparent power -',
            11: 'Current',
            12: 'Voltage',
            13: 'Power factor',
            14: 'Frequency',
            16: 'Total active power',
            21: 'L1 active power +',
            22: 'L1 active power -',
            23: 'L1 reactive power +',
            24: 'L1 reactive power -',
            25: 'L1 reactive power Q I',
            26: 'L1 reactive power Q II',
            27: 'L1 reactive power Q III',
            28: 'L1 reactive power Q IV',
            29: 'L1 apparent power +',
            30: 'L1 apparent power -',
            31: 'L1 current',
            32: 'L1 voltage',
            33: 'L1 power factor',
            41: 'L2 active power +',
            42: 'L2 active power -',
            43: 'L2 reactive power +',
            44: 'L2 reactive power -',
            45: 'L2 reactive power Q I',
            46: 'L2 reactive power Q II',
            47: 'L2 reactive power Q III',
            48: 'L2 reactive power Q IV',
            49: 'L2 apparent power +',
            50: 'L2 apparent power -',
            51: 'L2 current',
            52: 'L2 voltage',
            53: 'L2 power factor',
            61: 'L3 active power +',
            62: 'L3 active power -',
            63: 'L3 reactive power +',
            64: 'L3 reactive power -',
            65: 'L3 reactive power Q I',
            66: 'L3 reactive power Q II',
            67: 'L3 reactive power Q III',
            68: 'L3 reactive power Q IV',
            69: 'L3 apparent power +',
            70: 'L3 apparent power -',
            71: 'L3 current',
            72: 'L3 voltage',
            73: 'L3 power factor',
            81: 'Angles',
            82: 'Unitless quantity',
            91: 'Neutral current',
            92: 'Neutral voltage',
            94: 'Country specific identifier',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
            0:  'General purpose',
            1:  'Summe Wirkarbeit Bezug +',
            2:  'Summe Wirkarbeit Abgabe -',
            3:  'Summe Blindarbeit Bezug +',
            4:  'Summe Blindarbeit Abgabe -',
            5:  'Summe Blindarbeit Q I',
            6:  'Summe Blindarbeit Q II',
            7:  'Summe Blindarbeit Q III',
            8:  'Summe Blindarbeit Q IV',
            9:  'Summe Scheinleistung Bezug +',
            10: 'Summe Scheinleistung Abgabe -',
            11: 'Strom',
            12: 'Spannung',
            13: 'Leistungsfaktor',
            14: 'Frequenz',
            16: 'Gesamtwirkleistung',
            21: 'L1 Wirkarbeit Bezug +',
            22: 'L1 Wirkarbeit Abgabe -',
            23: 'L1 Blindarbeit Bezug +',
            24: 'L1 Blindarbeit Abgabe -',
            25: 'L1 Blindarbeit Q I',
            26: 'L1 Blindarbeit Q II',
            27: 'L1 Blindarbeit Q III',
            28: 'L1 Blindarbeit Q IV',
            29: 'L1 Scheinleistung Bezug +',
            30: 'L1 Scheinleistung Abgabe -',
            31: 'L1 Strom',
            32: 'L1 Spannung',
            33: 'L1 Leistungsfaktor',
            41: 'L2 Wirkarbeit Bezug +',
            42: 'L2 Wirkarbeit Abgabe -',
            43: 'L2 Blindarbeit Bezug +',
            44: 'L2 Blindarbeit Abgabe -',
            45: 'L2 Blindarbeit Q I',
            46: 'L2 Blindarbeit Q II',
            47: 'L2 Blindarbeit Q III',
            48: 'L2 Blindarbeit Q IV',
            49: 'L2 Scheinleistung Bezug +',
            50: 'L2 Scheinleistung Abgabe -',
            51: 'L2 Strom',
            52: 'L2 Spannung',
            53: 'L2 Leistungsfaktor',
            61: 'L3 Wirkarbeit Bezug +',
            62: 'L3 Wirkarbeit Abgabe -',
            63: 'L3 Blindarbeit Bezug +',
            64: 'L3 Blindarbeit Abgabe -',
            65: 'L3 Blindarbeit Q I',
            66: 'L3 Blindarbeit Q II',
            67: 'L3 Blindarbeit Q III',
            68: 'L3 Blindarbeit Q IV',
            69: 'L3 Scheinleistung Bezug +',
            70: 'L3 Scheinleistung Abgabe -',
            71: 'L3 Strom',
            72: 'L3 Spannung',
            73: 'L3 Leistungsfaktor',
            81: 'Winkel',
            82: 'Anzahl ohne EInheit',
            91: 'Neutraler Strom',
            92: 'Neutrale Spannung',
            94: 'Länderspezifisch',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    },
    4: { // Thermal
        'en': {
            1: 'Costs',
            99: 'Costs',
            96: 'Service entry',
            97: 'Error message',
            98: 'List'
        },
        'de': {
        	1: 'Kosten',
            70: 'Beschaffenheit',
        	99: 'Profilwert',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen'
        }
    },
    5: { // Cooling
        'en': {
            1: 'Cooling',
            99: 'Cooling',
            96: 'Service entry',
            97: 'Error message',
            98: 'List'
        },
        'de': {
        	1: 'Kälte',
        	99: 'Kälte',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen'
        }
    },
    6: { // Heating
        'en': {
            1:  'Heat',
            3:  'Heat',
            99: 'Heat',
            96: 'Service entry',
            97: 'Error message',
            98: 'List'
        },
        'de': {
            1: 'Wärme',
            3: 'Wärme',
        	99: 'Wärme'
        }
    },
    7: { // Gas
        'en': {
            128: 'Gas',
            129: 'Gas',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
            128: 'Betriebskubikmeter',
            129: 'Normkubikmeter',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    },
    8: { // Cold water
        'en': {
            99: 'Cold water',
            128: 'Drinking water',
            129: 'Raw water',
            130: 'VE-Water',
            96: 'Service entry',
            97: 'Error message',
            98: 'List'
        },
        'de': {
            99: 'Trinkwasser / Brauchwasser kalt',
            128: 'Trinkwasser',
            129: 'Brauchwasser',
            130: 'VE-Wasser',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen'
        }
    },
    9: { // Warm water
        'en': {
            99:  'Warm water',
            128: 'Drinking water',
            129: 'Raw water',
            130: 'VE-Water',
            96: 'Service entry',
            97: 'Error message',
            98: 'List'
        },
        'de': {
            99:  'Trinkwasser / Brauchwasser Warm',
            128: 'Trinkwasser',
            129: 'Brauchwasser',
            130: 'VE-Wasser',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen'
        }
    },
    16: { // Oli
        'en': {
            128: 'Oil',
            129: 'Oil',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
            128: 'Öl',
            129: 'Öl',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    },
    17: { // Compressed Air
        'en': {
            128: 'Compressed Air',
            129: 'Compressed Air',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
            128: 'Betriebskubikmeter',
            129: 'Normkubikmeter',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    },
    18: { // Nitrogen
        'en': {
            128: 'Compressed Air',
            129: 'Compressed Air',
            96: 'Service entry',
            97: 'Error message',
            98: 'List',
            99: 'Data profiles, Load profiles P.01/ P.02, Operation Log P.98/ P.99'
        },
        'de': {
            128: 'Betriebskubikmeter',
            129: 'Normkubikmeter',
            96: 'Wartungseintrag',
            97: 'Fehler',
            98: 'Listen',
            99: 'Datenprofile, Lastgang P.01/ P.02, Betriebslogbuch P.98/ P.99'
        }
    }
};

const obisMeasurementType = {
    1: { // Electricity
        'en': {
        	0:  'Billing period average',
        	1:  'Cumulative minimum 1',
        	2:  'Cumulative maximum 1',
        	3:  'Minimum 1',
        	4:  'Current average 1',
        	5:  'Last average 1',
        	6:  'Maximum 1',
            7:  'Instantaneous value',
        	8:  'Time integral 1',
        	9:  'Time integral 2',
        	10: 'Time integral 3',
        	11: 'Cumulative minimum 2',
        	12: 'Cumulative maximum 2',
        	13: 'Minimum 2',
        	14: 'Current average 2',
        	15: 'Last average 2',
        	16: 'Maximum 2',

        	21: 'Cumulative minimum 3',
        	22: 'Cumulative maximum 3',
        	23: 'Minimum 3',
        	24: 'Current average 3',
        	25: 'Last average 3',
        	26: 'Maximum 3',

        	27: 'Current average 5',
        	28: 'Current average 6',
        	29: 'Time integral 5',
        	30: 'Time integral 6',

        	31: 'Under limit threshold',
        	32: 'Under limit occurrence counter',
        	33: 'Under limit duration',
        	34: 'Under limit magnitude',
        	35: 'Over limit threshold',
        	36: 'Over limit occurrence counter',
        	37: 'Over limit duration',
        	38: 'Over limit magnitude',
        	39: 'Missing threshold',
        	40: 'Missing occurrence counter',
        	41: 'Missing duration',
        	42: 'Missing magnitude',

        	55: 'Test average',
        	58: 'Time integral 4'
        },
        'de': {
        	0:  'Mittelwert Abrechnungszeitraum',

        	1:  'Kummuliertes Minimum 1',
        	2:  'Kummuliertes Maximum 1',
        	3:  'Minimum 1',
        	4:  'Aktueller Mittelwert 1',
        	5:  'Letzter Mittelwert 1',
        	6:  'Maximum 1',

            7:  'Momentanwert',
        	8:  'Zählerstand 1',
        	9:  'Vorschub 2',
        	10: 'Time integral 3',

        	11: 'Kummuliertes Minimum 2',
        	12: 'Kummuliertes Maximum 2',
        	13: 'Minimum 2',
        	14: 'Aktueller Mittelwert 2',
        	15: 'Letzter Mittelwert 2',
        	16: 'Maximum 2',

        	21: 'Kummuliertes Minimum 3',
        	22: 'Kummuliertes Maximum 3',
        	23: 'Minimum 3',
        	24: 'Aktueller Mittelwert 3',
        	25: 'Letzter Mittelwert 3',
        	26: 'Maximum 3',

        	27: 'Current average 5',
        	28: 'Current average 6',
        	29: 'Lastgang',
        	30: 'Time integral 6',

        	31: 'Under limit threshold',
        	32: 'Under limit occurrence counter',
        	33: 'Under limit duration',
        	34: 'Under limit magnitude',

        	35: 'Over limit threshold',
        	36: 'Over limit occurrence counter',
        	37: 'Over limit duration',
        	38: 'Over limit magnitude',

        	39: 'Missing threshold',
        	40: 'Missing occurrence counter',
        	41: 'Missing duration',
        	42: 'Missing magnitude',

        	55: 'Test average',
        	58: 'Time integral 4'
        }
    },
    4: { // Thermal
        'en': {
        	0:  'Counter Reading',
            1:  'Active power'
        },
        'de': {
        	0:  'Zählerstand',
            1:  'Lastgang'
        }
    },
    5: { // Cooling
        'en': {
            0:  'Counter Reading',
            1:  'Active power'
        },
        'de': {
            0:  'Zählerstand',
            1:  'Lastgang'
        }
    },
    6: { // Heating
        'en': {
            0:  'Counter Reading',
            1:  'Active power'
        },
        'de': {
            0:  'Zählerstand',
            1:  'Lastgang'
        }
    },
    7: { // Gas
        'en': {
            128:  'Counter Reading',
            129:  'Vorschub',
            130:  'Active power'
        },
        'de': {
            128:  'Zählerstand',
            129:  'Vorschub',
            130:  'Lastgang'
        }
    },
    8: { // Water Cold
        'en': {
            1:  'Counter Reading',
            130:  'Active power'
        },
        'de': {
            1:  'Zählerstand',
            130:  'Lastgang'
        }
    },
    9: { // Water Cold
        'en': {
            1:  'Counter Reading',
            130:  'Active power'
        },
        'de': {
            1:  'Zählerstand',
            130:  'Lastgang'
        }
    },
    16: { // Oil
        'en': {
            128:  'Counter Reading',
            129:  'Vorschub',
            130:  'Active power'
        },
        'de': {
            128:  'Zählerstand',
            129:  'Vorschub',
            130:  'Lastgang'
        }
    },
    17: { // Compressed Air
        'en': {
            128:  'Counter Reading',
            129:  'Vorschub',
            130:  'Active power'
        },
        'de': {
            128:  'Zählerstand',
            129:  'Vorschub',
            130:  'Lastgang'
        }
    },
    18: { // Nitrogen
        'en': {
            128:  'Counter Reading',
            129:  'Vorschub',
            130:  'Active power'
        },
        'de': {
            128:  'Zählerstand',
            129:  'Vorschub',
            130:  'Lastgang'
        }
    }
};

const obisTariffRate = {
    'en': {
        0:  'Total',
        1:  'T1',
        2:  'T2',
        3:  'T3',
        4:  'T4',
        5:  'T5',
        6:  'T6',
        7:  'T7',
        8:  'T8',
        9:  'T9'
    },
    'de': {
    }
};

const obisPreviousMeasurement = {
    'en': {
        0:    '',
        1:    'previous Year', // 2WR5
        2:    'previous Month', // 2WR5
        128:  'today',
        129:  'yesterday',
        130:  'previous Week',
        131:  'previous Month',
        132:  'previous Year',
        255:  ''
    },
    'de': {
        0:    '',
        1:    'letztes Jahr', // 2WR5
        2:    'letzter Monat', // 2WR5
        128:  'heute',
        129:  'gestern',
        130:  'letzte Woche',
        131:  'letzter Monat',
        132:  'letztes Jahr',
        255:  ''
    }
};

const obisMeasurementCustom = {
    'en': {
        //eHz
        '96.1.0': 'Serialnumber',
        '96.1.255': 'Factory number',
        '96.5.5': 'Status',
        '0.0.0': 'Meter owner number',
        '1-0:96.50.0*0': 'Net Status',
        '1-0:96.50.0*1': 'Net Frequency',
        '1-0:96.50.0*2': 'Current Chip Temperature',
        '1-0:96.50.0*3': 'Min Chip Temperature',
        '1-0:96.50.0*4': 'Average Chip Temperature',
        '1-0:96.50.0*5': 'Max Chip Temperature',
        '1-0:96.50.0*6': 'Control number',
        '1-0:96.50.0*7': 'Diagnose',

        //Swiss
        '255.255.16.8.0*255': 'Sum active energy (Total)',
        '255.255.16.8.1*255': 'Sum active energy (T1)',
        '255.255.16.8.2*255': 'Sum active energy (T2)',

        //Efr Smart Grid Hub
        '129-129:199.130.39': 'Customer number',
        '129-129:199.130.5':  'Forename/Public Key',
        '129-129:199.130.6':  'Surname',
        '129-129:199.130.7':  'Address',
        '1-0:0.9.11':  'Timestamp',

        //eHz SML
        '129-129:199.130.3*255': 'Manufacturer ID',
        '1-0:0.0.9*255': 'Device ID',

        //Easymeter
        '15.8.0': 'Zählerstand',

        // Additional from various sources
        '0.0.1': 'Identification',
        '0.1.0': 'Reset counter',
        '0.1.2': 'Reset Timestamp',
        '0.2.0': 'Firmware version',
        '0.9.1': 'Current Time',
        '0.9.2': 'Current Date',

        // 2WR5 heat station
        '0.0': 'Meter owner number',
        '6.4':  'Power Nb',
        '6.6':  'Max Power Nb',
        '6.8': 'Heat quantity Nb',
        '6.8.1': 'Heat quantity Nb (T1)',
        '6.8.2': 'Supplied or returned heat quantity Nb',
        '6.8.3': 'Cold energy Nb',
        '6.8.4': 'Heat quantity Nb (T2)',
        '6.8.5': 'Heat quantity Nb (T3)',
        '6.26': 'Volume Nb',
        '6.27': 'Flowrate Nb',
        '6.28': 'Temperature return Nb',
        '6.29': 'Temperature flow Nb',
        '6.30': 'Temperature difference Nb',
        '6.31': 'Operating duration',
        '6.32': 'Fault duration',
        '6.33': 'Max flowrate Nb',
        '6.35': 'Masuring period',
        '6.36': 'Set day',
        '6.36*2': 'monthly set day',
        '6.36.1': 'Timestamp of max power',
        '6.36.2': 'Timestamp of max flowrate',
        '6.36.3': 'Timestamp of max flow temperature',
        '6.36.4': 'Timestamp of max return temperature',
        '6.36.5': 'Timestamp of F0 prewarning',
        '9.1':   'Device configuration',
        '9.2':   'Simulation',
        '9.3':   'Prescalers',
        '9.4':   'Max temperatures Nb',
        '9.5':   'Measuring path parameters 1',
        '9.5*1':   'Measuring path parameters 2',
        '9.5*2':   'Parameters for fast pulses',
        '9.5*3':   'Tariff switchover time',
        '9.6':   'M-bus address',
        '9.7':   'Expansion',
        '9.8':   'Heat quantity Pb',
        '9.15':   'Supplied heat quantity Nb',
        '9.16':   'Returned heat quantity Nb',
        '9.17':  'Tariff selection',
        '9.18':  'Tariff threshold value 1',
        '9.19':  'Tariff threshold value 2',
        '9.20':  'Device number',
        '9.21':  'K Number',
        '9.22':  'Mounting location',
        '9.23':  'Calibration values',
        '9.24':  'Measuring range',
        '9.25':  'Tariff threshold value 3',
        '9.26':  'Volume Pb',
        '9.27':  'Flowrate Pb',
        '9.28':  'Temperature return Pb',
        '9.29':  'Flow temperature threshold value for energy',
        '9.30':  'Temperature difference Pb',
        '9.36':  ' System date and time'
    },
    'de': {
    }
};



function resolveData(obj, id, language) {
    //console.log('LOOKUP '+id);
    if (obj[language][id]) return obj[language][id];
    if (language==='de' && obj.en[id]) return obj.en[id];
    if (language==='en' && obj.de[id]) return obj.de[id];
    return '';
}

function resolveDetailData(obj, medium, id, language) {
    //console.log('LOOKUP '+medium+' - '+id);
    if (obj[medium] && obj[medium][language] && obj[medium][language][id]) return obj[medium][language][id];
    if (language==='de' && obj[medium] && obj[medium].en && obj[medium].en[id]) return obj[medium].en[id];
    if (language==='en' && obj[medium] && obj[medium].de && obj[medium].de[id]) return obj[medium].de[id];
    return '';
}


function resolveMediumName(medium, language) {
	return resolveData(obisMedium, medium, language);
}

function resolveChannelName(channel, language) {
	return resolveData(obisChannel, channel, language);
}

function resolveMeasurementName(medium, measurement, language) {
	return resolveDetailData(obisMeasurement, medium, measurement, language);
}

function resolveMeasurementTypeName(medium, measurementType, language) {
	return resolveDetailData(obisMeasurementType, medium, measurementType, language);
}

function resolveTariffRateName(tariffRate, language) {
	return resolveData(obisTariffRate, tariffRate, language);
}

function resolvePreviousMeasurementName(previousMeasurement, language) {
	return resolveData(obisPreviousMeasurement, previousMeasurement, language);
}

function resolveCustomName(obisId, language) {
    //console.log('LOOKUP: ' + obisId + ' / ' + language);
    return resolveData(obisMeasurementCustom, obisId, language);
}

function resolveObisName(obisObj, language) {
    var result = {};
    result.mediumName = resolveMediumName(obisObj.medium, language);
    result.channelName = resolveChannelName(obisObj.channel, language);
    result.measurementName = resolveMeasurementName(obisObj.medium, obisObj.measurement, language);
    result.measurementTypeName = resolveMeasurementTypeName(obisObj.medium, obisObj.measureType, language);
    result.tariffRateName = resolveTariffRateName(obisObj.tariffRate, language);
    result.previousMeasurementName = resolvePreviousMeasurementName(obisObj.previousMeasurement, language);
    var customMatch = false;
    result.customName = resolveCustomName(obisObj.idToString('full'), language);
    if (result.customName !== '') {
        customMatch = 'full';
    }
    else {
        result.customName = resolveCustomName(obisObj.idToString('base'), language);
        if (result.customName !== '') {
            customMatch = 'base';
        }
        else {
            result.customName = resolveCustomName(obisObj.idToString('extended'), language);
            if (result.customName !== '') {
                customMatch = 'extended';
            }
        }
    }
    if (result.customName !== '') {
        result.obisName = result.customName;
        if (customMatch !== 'full' && result.previousMeasurementName.length >0) {
            result.obisName += ' ' + result.previousMeasurementName;
        }
    }
    else {
        result.obisName = result.measurementTypeName;
        if (result.measurementTypeName.length > 0) result.obisName += ' ';
        result.obisName += result.measurementName;
        if (result.measurementName.length > 0) result.obisName += ' ';
        if (result.tariffRateName !== '') result.obisName += '(' + result.tariffRateName + ')';
        if (result.tariffRateName.length > 0) result.obisName += ' ';
        result.obisName += result.previousMeasurementName;
    }
    result.obisName = result.obisName.trim();

    return result;
}

module.exports.resolveObisName = resolveObisName;
