/* jshint -W097 */// jshint strict:false
/*jslint node: true */
/*jslint esversion: 6 */

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

const obisMeasure = {
    0: { // Abstract Objects
        'en': {
        	128: 'Temperature',
            129: 'Status',
        	130: 'Humidity',
            131: 'Light Intensity',
            132: 'Operating Hours',
            133: 'Units'
        },
        'de': {
        	128: 'Temperatur',
            129: 'Status',
        	130: 'Feuchte',
            131: 'Lichtstärke',
            132: 'Betriebsstunden',
            133: 'Stückzahl'
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
    }
    2: { // Thermal
        'en': {
            1: 'power',
            2: 'energy'
        },
        'de': {
        	1: 'power',
        	2: 'energy'
        }
    }
};


const obisMode = {
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
        	9:  'Vorschub 2', //??
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
        }
    1: {

    }
};


function resolveMediumName(medium, language) {
	return obisMedium[language][medium];
}

module.exports.resolveMediumName = resolveMediumName;

/*	@property
	def medium_display(self):
		return MEDIUM.get(self.medium, 'unknown')

	@property
	def measure_display(self):
		if self.medium == '1':
			measures = MEASURE_ELECTRICITY
		else:
			return 'unknown'
		return measures.get(self.measure, 'unknown')

	@property
	def mode_display(self):
		if self.medium == '1':
			modes = MODE_ELECTRICITY
		else:
			return 'unknown'
return modes.get(self.mode, 'unknown')
*/
