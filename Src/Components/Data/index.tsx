import CommonImages from '../../Common/CommonImages';
import {GenderTypes} from '../../Types/GenderTypes';

export interface ContactTabType {
  id: number;
  title: string;
}

export const ContactTabData: ContactTabType[] = [
  {
    id: 1,
    title: 'Contacts',
  },
  {
    id: 2,
    title: 'Blocked',
  },
];

export interface Country {
  name: string;
  code: string;
  dialling_code: string;
}

export const CountryWithCode: Country[] = [
  {
    name: 'Albania',
    code: 'AL',
    dialling_code: '+355',
  },
  {
    name: 'Algeria',
    code: 'DZ',
    dialling_code: '+213',
  },
  {
    name: 'American Samoa',
    code: 'AS',
    dialling_code: '+1',
  },
  {
    name: 'Andorra',
    code: 'AD',
    dialling_code: '+376',
  },
  {
    name: 'Angola',
    code: 'AO',
    dialling_code: '+244',
  },
  {
    name: 'Anguilla',
    code: 'AI',
    dialling_code: '+43',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
    dialling_code: '+1',
  },
  {
    name: 'Argentina',
    code: 'AR',
    dialling_code: '+54',
  },
  {
    name: 'Armenia',
    code: 'AM',
    dialling_code: '+374',
  },
  {
    name: 'Aruba',
    code: 'AW',
    dialling_code: '+297',
  },
  {
    name: 'Australia',
    code: 'AU',
    dialling_code: '+61',
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
    dialling_code: '+994',
  },
  {
    name: 'Bahamas',
    code: 'BS',
    dialling_code: '+1',
  },
  {
    name: 'Bahrain',
    code: 'BH',
    dialling_code: '+973',
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    dialling_code: '+880',
  },
  {
    name: 'Barbados',
    code: 'BB',
    dialling_code: '+1',
  },
  {
    name: 'Belarus',
    code: 'BY',
    dialling_code: '+375',
  },
  {
    name: 'Belgium',
    code: 'BE',
    dialling_code: '+32',
  },
  {
    name: 'Belize',
    code: 'BZ',
    dialling_code: '+501',
  },
  {
    name: 'Benin',
    code: 'BJ',
    dialling_code: '+229',
  },
  {
    name: 'Bermuda',
    code: 'BM',
    dialling_code: '+1',
  },
  {
    name: 'Bhutan',
    code: 'BT',
    dialling_code: '+975',
  },
  {
    name: 'Bolivia (Plurinational State of)',
    code: 'BO',
    dialling_code: '+591',
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    dialling_code: '+387',
  },
  {
    name: 'Botswana',
    code: 'BW',
    dialling_code: '+267',
  },
  {
    name: 'Brazil',
    code: 'BR',
    dialling_code: '+55',
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
    dialling_code: '+246',
  },
  {
    name: 'Virgin Islands (British)',
    code: 'VG',
    dialling_code: '+1',
  },
  {
    name: 'Virgin Islands (U.S.)',
    code: 'VI',
    dialling_code: '+1',
  },
  {
    name: 'Brunei Darussalam',
    code: 'BN',
    dialling_code: '+673',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
    dialling_code: '+359',
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    dialling_code: '+226',
  },
  {
    name: 'Burundi',
    code: 'BI',
    dialling_code: '+257',
  },
  {
    name: 'Cambodia',
    code: 'KH',
    dialling_code: '+855',
  },
  {
    name: 'Cameroon',
    code: 'CM',
    dialling_code: '+237',
  },
  {
    name: 'Canada',
    code: 'CA',
    dialling_code: '+1',
  },
  {
    name: 'Cabo Verde',
    code: 'CV',
    dialling_code: '+238',
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
    dialling_code: '+1',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    dialling_code: '+236',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    dialling_code: '+236',
  },
  {
    name: 'Chile',
    code: 'CL',
    dialling_code: '+56',
  },
  {
    name: 'China',
    code: 'CN',
    dialling_code: '+86',
  },
  {
    name: 'Colombia',
    code: 'CO',
    dialling_code: '+57',
  },
  {
    name: 'Comoros',
    code: 'KM',
    dialling_code: '+269',
  },
  {
    name: 'Congo',
    code: 'CG',
    dialling_code: '+242',
  },
  {
    name: 'Congo (Democratic Republic of the)',
    code: 'CD',
    dialling_code: '+243',
  },
  {
    name: 'Cook Islands',
    code: 'CK',
    dialling_code: '+682',
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    dialling_code: '+506',
  },
  {
    name: 'Croatia',
    code: 'HR',
    dialling_code: '+385',
  },
  {
    name: 'Cuba',
    code: 'CU',
    dialling_code: '+53',
  },
  {
    name: 'Cuba',
    code: 'CU',
    dialling_code: '+53',
  },
  {
    name: 'Cyprus',
    code: 'CY',
    dialling_code: '+357',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    dialling_code: '+420',
  },
  {
    name: 'Denmark',
    code: 'DK',
    dialling_code: '+45',
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    dialling_code: '+253',
  },
  {
    name: 'Dominica',
    code: 'DM',
    dialling_code: '+1',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
    dialling_code: '+1',
  },
  {
    name: 'Ecuador',
    code: 'EC',
    dialling_code: '+593',
  },
  {
    name: 'Egypt',
    code: 'EG',
    dialling_code: '+20',
  },
  {
    name: 'El Salvador',
    code: 'SV',
    dialling_code: '+503',
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    dialling_code: '+240',
  },
  {
    name: 'Eritrea',
    code: 'ER',
    dialling_code: '+291',
  },
  {
    name: 'Estonia',
    code: 'EE',
    dialling_code: '+372',
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialling_code: '+251',
  },
  {
    name: 'Falkland Islands (Malvinas)',
    code: 'FK',
    dialling_code: '+500',
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
    dialling_code: '+298',
  },
  {
    name: 'Fiji',
    code: 'FJ',
    dialling_code: '+679',
  },
  {
    name: 'Finland',
    code: 'FI',
    dialling_code: '+358',
  },
  {
    name: 'France',
    code: 'FR',
    dialling_code: '+33',
  },
  {
    name: 'French Guiana',
    code: 'GF',
    dialling_code: '+594',
  },
  {
    name: 'French Polynesia',
    code: 'PF',
    dialling_code: '+689',
  },
  {
    name: 'Gabon',
    code: 'GA',
    dialling_code: '+241',
  },
  {
    name: 'Gambia',
    code: 'GM',
    dialling_code: '+220',
  },
  {
    name: 'Georgia',
    code: 'GE',
    dialling_code: '+995',
  },
  {
    name: 'Germany',
    code: 'DE',
    dialling_code: '+49',
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialling_code: '+233',
  },
  {
    name: 'Gibraltar',
    code: 'GI',
    dialling_code: '+350',
  },
  {
    name: 'Greece',
    code: 'GR',
    dialling_code: '+30',
  },
  {
    name: 'Greenland',
    code: 'GL',
    dialling_code: '+299',
  },
  {
    name: 'Grenada',
    code: 'GD',
    dialling_code: '+1',
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
    dialling_code: '+590',
  },
  {
    name: 'Guam',
    code: 'GU',
    dialling_code: '+1',
  },
  {
    name: 'Guatemala',
    code: 'GT',
    dialling_code: '+502',
  },
  {
    name: 'Guinea',
    code: 'GN',
    dialling_code: '+224',
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    dialling_code: '+245',
  },
  {
    name: 'Guyana',
    code: 'GY',
    dialling_code: '+592',
  },
  {
    name: 'Haiti',
    code: 'HT',
    dialling_code: '+509',
  },
  {
    name: 'Holy See',
    code: 'VA',
    dialling_code: '+39',
  },
  {
    name: 'Honduras',
    code: 'HN',
    dialling_code: '+504',
  },
  {
    name: 'Hong Kong',
    code: 'HK',
    dialling_code: '+852',
  },
  {
    name: 'Hungary',
    code: 'HU',
    dialling_code: '+36',
  },
  {
    name: 'Iceland',
    code: 'IS',
    dialling_code: '+354',
  },
  {
    name: 'India',
    code: 'IN',
    dialling_code: '+91',
  },
  {
    name: 'Indonesia',
    code: 'ID',
    dialling_code: '+62',
  },
  {
    name: 'Iran (Islamic Republic of)',
    code: 'IR',
    dialling_code: '+98',
  },
  {
    name: 'Iraq',
    code: 'IQ',
    dialling_code: '+964',
  },
  {
    name: 'Ireland',
    code: 'IE',
    dialling_code: '+353',
  },
  {
    name: 'Israel',
    code: 'IL',
    dialling_code: '+972',
  },
  {
    name: 'Italy',
    code: 'IT',
    dialling_code: '+39',
  },
  {
    name: 'Jamaica',
    code: 'JM',
    dialling_code: '+1',
  },
  {
    name: 'Japan',
    code: 'JP',
    dialling_code: '+81',
  },
  {
    name: 'Jordan',
    code: 'JO',
    dialling_code: '+962',
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    dialling_code: '+7',
  },
  {
    name: 'Kenya',
    code: 'KE',
    dialling_code: '+254',
  },
  {
    name: 'Kiribati',
    code: 'KI',
    dialling_code: '+686',
  },
  {
    name: 'Kuwait',
    code: 'KW',
    dialling_code: '+965',
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
    dialling_code: '+996',
  },
  {
    name: "Lao People's Democratic Republic",
    code: 'LA',
    dialling_code: '+856',
  },
  {
    name: 'Latvia',
    code: 'LV',
    dialling_code: '+371',
  },
  {
    name: 'Lebanon',
    code: 'LB',
    dialling_code: '+961',
  },
  {
    name: 'Lesotho',
    code: 'LS',
    dialling_code: '+266',
  },
  {
    name: 'Liberia',
    code: 'LR',
    dialling_code: '+231',
  },
  {
    name: 'Libya',
    code: 'LY',
    dialling_code: '+218',
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
    dialling_code: '+423',
  },
  {
    name: 'Lithuania',
    code: 'LT',
    dialling_code: '+370',
  },
  {
    name: 'Luxembourg',
    code: 'LU',
    dialling_code: '+352',
  },
  {
    name: 'Macao',
    code: 'MO',
    dialling_code: '+853',
  },
  {
    name: 'Macedonia (the former Yugoslav Republic of)',
    code: 'MK',
    dialling_code: '+389',
  },
  {
    name: 'Madagascar',
    code: 'MG',
    dialling_code: '+261',
  },
  {
    name: 'Malawi',
    code: 'MW',
    dialling_code: '+265',
  },
  {
    name: 'Malaysia',
    code: 'MY',
    dialling_code: '+60',
  },
  {
    name: 'Maldives',
    code: 'MV',
    dialling_code: '+960',
  },
  {
    name: 'Mali',
    code: 'ML',
    dialling_code: '+223',
  },
  {
    name: 'Malta',
    code: 'MT',
    dialling_code: '+356',
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
    dialling_code: '+692',
  },
  {
    name: 'Martinique',
    code: 'MQ',
    dialling_code: '+596',
  },
  {
    name: 'Mauritania',
    code: 'MR',
    dialling_code: '+222',
  },
  {
    name: 'Mauritius',
    code: 'MU',
    dialling_code: '+230',
  },
  {
    name: 'Mayotte',
    code: 'YT',
    dialling_code: '+262',
  },
  {
    name: 'Mexico',
    code: 'MX',
    dialling_code: '+52',
  },
  {
    name: 'Micronesia (Federated States of)',
    code: 'FM',
    dialling_code: '+691',
  },
  {
    name: 'Moldova (Republic of)',
    code: 'MD',
    dialling_code: '+373',
  },
  {
    name: 'Monaco',
    code: 'MC',
    dialling_code: '+377',
  },
  {
    name: 'Mongolia',
    code: 'MN',
    dialling_code: '+976',
  },
  {
    name: 'Montenegro',
    code: 'ME',
    dialling_code: '+382',
  },
  {
    name: 'Montserrat',
    code: 'MS',
    dialling_code: '+1',
  },
  {
    name: 'Morocco',
    code: 'MA',
    dialling_code: '+212',
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    dialling_code: '+258',
  },
  {
    name: 'Myanmar',
    code: 'MM',
    dialling_code: '+95',
  },
  {
    name: 'Namibia',
    code: 'NA',
    dialling_code: '+264',
  },
  {
    name: 'Nauru',
    code: 'NR',
    dialling_code: '+674',
  },
  {
    name: 'Nepal',
    code: 'NP',
    dialling_code: '+977',
  },
  {
    name: 'Netherlands',
    code: 'NL',
    dialling_code: '+31',
  },
  {
    name: 'New Caledonia',
    code: 'NC',
    dialling_code: '+687',
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    dialling_code: '+64',
  },
  {
    name: 'Nicaragua',
    code: 'NI',
    dialling_code: '+505',
  },
  {
    name: 'Niger',
    code: 'NE',
    dialling_code: '+227',
  },
  {
    name: 'Nigeria',
    code: 'NG',
    dialling_code: '+234',
  },
  {
    name: 'Niue',
    code: 'NU',
    dialling_code: '+683',
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
    dialling_code: '+672',
  },
  {
    name: "Korea (Democratic People's Republic of)",
    code: 'KP',
    dialling_code: '+850',
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
    dialling_code: '+1',
  },
  {
    name: 'Norway',
    code: 'NO',
    dialling_code: '+47',
  },
  {
    name: 'Oman',
    code: 'OM',
    dialling_code: '+968',
  },
  {
    name: 'Pakistan',
    code: 'PK',
    dialling_code: '+92',
  },
  {
    name: 'Palau',
    code: 'PW',
    dialling_code: '+680',
  },
  {
    name: 'Palestine, State of',
    code: 'PS',
    dialling_code: '+970',
  },
  {
    name: 'Panama',
    code: 'PA',
    dialling_code: '+507',
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    dialling_code: '+675',
  },
  {
    name: 'Paraguay',
    code: 'PY',
    dialling_code: '+595',
  },
  {
    name: 'Peru',
    code: 'PE',
    dialling_code: '+51',
  },
  {
    name: 'Philippines',
    code: 'PH',
    dialling_code: '+63',
  },
  {
    name: 'Poland',
    code: 'PL',
    dialling_code: '+48',
  },
  {
    name: 'Portugal',
    code: 'PT',
    dialling_code: '+351',
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
    dialling_code: '+1',
  },
  {
    name: 'Qatar',
    code: 'QA',
    dialling_code: '+974',
  },
  {
    name: 'Republic of Kosovo',
    code: 'XK',
    dialling_code: '+381',
  },
  {
    name: 'Romania',
    code: 'RO',
    dialling_code: '+40',
  },
  {
    name: 'Russian Federation',
    code: 'RU',
    dialling_code: '+7',
  },
  {
    name: 'Rwanda',
    code: 'RW',
    dialling_code: '+250',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
    dialling_code: '+1',
  },
  {
    name: 'Saint Martin (French part)',
    code: 'MF',
    dialling_code: '+590',
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
    dialling_code: '+508',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    dialling_code: '+1',
  },
  {
    name: 'Samoa',
    code: 'WS',
    dialling_code: '+685',
  },
  {
    name: 'San Marino',
    code: 'SM',
    dialling_code: '+378',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialling_code: '+966',
  },
  {
    name: 'Senegal',
    code: 'SN',
    dialling_code: '+221',
  },
  {
    name: 'Serbia',
    code: 'RS',
    dialling_code: '+381',
  },
  {
    name: 'Seychelles',
    code: 'SC',
    dialling_code: '+248',
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
    dialling_code: '+232',
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialling_code: '+65',
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialling_code: '+65',
  },
  {
    name: 'Slovakia',
    code: 'SK',
    dialling_code: '+421',
  },
  {
    name: 'Slovenia',
    code: 'SI',
    dialling_code: '+386',
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
    dialling_code: '+677',
  },
  {
    name: 'Somalia',
    code: 'SO',
    dialling_code: '+252',
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialling_code: '+27',
  },
  {
    name: 'Korea (Republic of)',
    code: 'KR',
    dialling_code: '+82',
  },
  {
    name: 'Spain',
    code: 'ES',
    dialling_code: '+34',
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    dialling_code: '+94',
  },
  {
    name: 'Sudan',
    code: 'SD',
    dialling_code: '+249',
  },
  {
    name: 'Suriname',
    code: 'SR',
    dialling_code: '+597',
  },
  {
    name: 'Swaziland',
    code: 'SZ',
    dialling_code: '+268',
  },
  {
    name: 'Sweden',
    code: 'SE',
    dialling_code: '+46',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    dialling_code: '+41',
  },
  {
    name: 'Syrian Arab Republic',
    code: 'SY',
    dialling_code: '+963',
  },
  {
    name: 'Taiwan',
    code: 'TW',
    dialling_code: '+886',
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
    dialling_code: '+992',
  },
  {
    name: 'Tanzania, United Republic of',
    code: 'TZ',
    dialling_code: '+255',
  },
  {
    name: 'Thailand',
    code: 'TH',
    dialling_code: '+66',
  },
  {
    name: 'Timor-Leste',
    code: 'TL',
    dialling_code: '+670',
  },
  {
    name: 'Togo',
    code: 'TG',
    dialling_code: '+228',
  },
  {
    name: 'Tokelau',
    code: 'TK',
    dialling_code: '+690',
  },
  {
    name: 'Tonga',
    code: 'TO',
    dialling_code: '+676',
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
    dialling_code: '+1',
  },
  {
    name: 'Tunisia',
    code: 'TN',
    dialling_code: '+216',
  },
  {
    name: 'Turkey',
    code: 'TR',
    dialling_code: '+90',
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
    dialling_code: '+993',
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
    dialling_code: '+1',
  },
  {
    name: 'Tuvalu',
    code: 'TV',
    dialling_code: '+688',
  },
  {
    name: 'Uganda',
    code: 'UG',
    dialling_code: '+256',
  },
  {
    name: 'Ukraine',
    code: 'UA',
    dialling_code: '+380',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialling_code: '+971',
  },
  {
    name: 'United Kingdom of Great Britain and Northern Ireland',
    code: 'GB',
    dialling_code: '+44',
  },
  {
    name: 'United States of America',
    code: 'US',
    dialling_code: '+1',
  },
  {
    name: 'Uruguay',
    code: 'UY',
    dialling_code: '+598',
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
    dialling_code: '+998',
  },
  {
    name: 'Vanuatu',
    code: 'VU',
    dialling_code: '+678',
  },
  {
    name: 'Venezuela (Bolivarian Republic of)',
    code: 'VE',
    dialling_code: '+58',
  },
  {
    name: 'Viet Nam',
    code: 'VN',
    dialling_code: '+84',
  },
  {
    name: 'Yemen',
    code: 'YE',
    dialling_code: '+967',
  },
  {
    name: 'Zambia',
    code: 'ZM',
    dialling_code: '+260',
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    dialling_code: '+263',
  },
];

export const MainGenders = ['Male', 'Female', 'Others'];

export interface AllGendersType {
  id: number;
  name: string;
}

export const AllGenders: AllGendersType[] = [
  {id: 1, name: 'Male'},
  {id: 2, name: 'Female'},
  {id: 3, name: 'Non-Binary'},
  {id: 4, name: 'Other'},
  {id: 5, name: 'Agender'},
  {id: 6, name: 'Bigender'},
  {id: 7, name: 'Demiboy'},
  {id: 8, name: 'Demigirl'},
  {id: 9, name: 'Androgynous'},
  {id: 10, name: 'Two-Spirit'},
  {id: 11, name: 'Genderqueer'},
  {id: 12, name: 'Genderfluid'},
  {id: 13, name: 'Neutrois'},
  {id: 14, name: 'Pangender'},
  {id: 15, name: 'Third Gender'},
  {id: 16, name: 'Cisgender'},
  {id: 17, name: 'Transgender'},
  {id: 18, name: 'Transmasculine'},
  {id: 19, name: 'Transfeminine'},
  {id: 20, name: 'Intersex'},
  {id: 21, name: 'Quoiromantic'},
  {id: 22, name: 'Quoisexual'},
  {id: 23, name: 'Graygender'},
  {id: 24, name: 'Demifluid'},
  {id: 25, name: 'Demiflux'},
  {id: 26, name: 'Neutrois'},
  {id: 27, name: 'Aporagender'},
  {id: 28, name: 'Libragender'},
  {id: 29, name: 'Xenogender'},
  {id: 30, name: 'Novigender'},
  {id: 31, name: 'Vapogender'},
  {id: 32, name: 'Cassgender'},
  {id: 33, name: 'Femfluid'},
  {id: 34, name: 'Mascfluid'},
  {id: 35, name: 'Genderfae'},
  {id: 36, name: 'Juxera'},
  {id: 37, name: 'Vibragender'},
  {id: 38, name: 'Anesigender'},
  {id: 39, name: 'Fluidflux'},
  {id: 40, name: 'Intergender'},
  {id: 41, name: 'Proxvir'},
  {id: 42, name: 'Liberique'},
  {id: 43, name: 'Astralgender'},
  {id: 44, name: 'Systemgender'},
  {id: 45, name: 'Tragender'},
  {id: 46, name: 'Twinkgender'},
  {id: 47, name: 'Softgender'},
  {id: 48, name: 'Aethergender'},
  {id: 49, name: 'Aerogender'},
  {id: 50, name: 'Faegender'},
  {id: 51, name: 'Surgender'},
  {id: 52, name: 'Magigender'},
  {id: 53, name: 'Epicene'},
  {id: 54, name: 'Ceterofluid'},
  {id: 55, name: 'Ceterogender'},
  {id: 56, name: 'Delphigender'},
  {id: 57, name: 'Vaguegender'},
  {id: 58, name: 'Librafeminine'},
  {id: 59, name: 'Libramasculine'},
  {id: 60, name: 'Vocigender'},
  {id: 61, name: 'Genderneutral'},
  {id: 62, name: 'Trigender'},
  {id: 63, name: 'Demineutral'},
  {id: 64, name: 'Masculine-of-Center'},
  {id: 65, name: 'Feminine-of-Center'},
  {id: 66, name: 'Ineutral'},
  {id: 67, name: 'Feminamasc'},
  {id: 68, name: 'Genderquestioning'},
  {id: 69, name: 'Aliusgender'},
  {id: 70, name: 'Nanogender'},
  {id: 71, name: 'Ambigender'},
  {id: 72, name: 'Boigender'},
  {id: 73, name: 'Queergender'},
  {id: 74, name: 'Omnigender'},
  {id: 75, name: 'Gemelgender'},
  {id: 76, name: 'Exgender'},
  {id: 77, name: 'Collgender'},
  {id: 78, name: 'Stellarian'},
  {id: 79, name: 'Intergender'},
  {id: 80, name: 'Cognigender'},
  {id: 81, name: 'Vexgender'},
  {id: 82, name: 'Egogender'},
  {id: 83, name: 'Birlgender'},
  {id: 84, name: 'Gendervague'},
  {id: 85, name: 'Batgender'},
  {id: 86, name: 'Surgender'},
  {id: 87, name: 'Brevigender'},
  {id: 88, name: 'Iridescentgender'},
  {id: 89, name: 'Venusgender'},
  {id: 90, name: 'Saturnigender'},
  {id: 91, name: 'Marfluid'},
  {id: 92, name: 'Equigender'},
  {id: 93, name: 'Veloxigender'},
  {id: 94, name: 'Tempgender'},
  {id: 95, name: 'Demiandrogyne'},
  {id: 96, name: 'Demiandrogyne'},
  {id: 97, name: 'Magiboy'},
  {id: 98, name: 'Magigirl'},
  {id: 99, name: 'Personagender'},
  {id: 100, name: 'Personagender'},
];

export const GendersData: GenderTypes[] = [
  {
    id: 0,
    name: 'Male',
    abbreviation: 'M',
  },
  {
    id: 1,
    name: 'Female',
    abbreviation: 'F',
  },
  {
    id: 2,
    name: 'Non-Binary',
    abbreviation: 'NB',
  },
  {
    id: 3,
    name: 'Other',
    abbreviation: 'O',
  },
  {
    id: 4,
    name: 'Agender',
    abbreviation: 'AG',
  },
  {
    id: 5,
    name: 'Bigender',
    abbreviation: 'BG',
  },
  {
    id: 6,
    name: 'Genderqueer',
    abbreviation: 'GQ',
  },
  {
    id: 7,
    name: 'Demiboy',
    abbreviation: 'DB',
  },
  {
    id: 8,
    name: 'Demigirl',
    abbreviation: 'DG',
  },
];

export interface LifestyleType {
  id: number;
  habit: string;
  key: string;
  options: string[];
}

export const ExerciseFrequencyData: string[] = ['Daily', 'Weekly', 'Rarely'];

export const SmokingDrinkingFrequencyData: string[] = [
  'Regularly',
  'Rarely',
  'Never',
];

export const MovieWatchingFrequencyData: string[] = [
  'Daily',
  'Weekly',
  'Monthly',
];

export const PreferredDrinkData: string[] = ['Milk', 'Tea', 'Coffee'];

export const LifestyleData: LifestyleType[] = [
  {
    id: 1,
    habit: 'Do you exercise?',
    key: 'exercise',
    options: ExerciseFrequencyData,
  },
  {
    id: 2,
    key: 'smoke',
    habit: 'How often do you smoke & drink?',
    options: SmokingDrinkingFrequencyData,
  },
  {
    id: 3,
    key: 'movies',
    habit: 'When do you watch movies?',
    options: MovieWatchingFrequencyData,
  },
  {
    id: 4,
    key: 'drink',
    habit: 'What do you like to drink?',
    options: PreferredDrinkData,
  },
];

export interface LookingForType {
  Title: string;
}

export const LookingFor: string[] = [
  'A Relationship',
  'New Friends',
  'Something Casual',
  "I'm Not Sure Yet",
  'Prefer Not To Say',
];

export interface WhatAboutYouType {
  id: number;
  habit: string;
  key: string;
  options: string[];
}

export const CommunicationStyleData: string[] = [
  'Introvert',
  'Extrovert',
  'Ambivert',
];

export const LoveLanguageData: string[] = [
  'Words of Affirmation',
  'Acts of Service',
  'Quality Time',
  'Physical Touch',
];

export const EducationLevelData: string[] = [
  'High School',
  'Some College',
  "Bachelor's Degree",
  "Master's Degree",
];

export const StarSignData: string[] = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
];

export const WhatAboutYouData: WhatAboutYouType[] = [
  {
    id: 0,
    habit: "What's your communication style?",
    key: 'communication_stry',
    options: CommunicationStyleData,
  },
  {
    id: 1,
    habit: 'How do you receive love?',
    key: 'recived_love',
    options: LoveLanguageData,
  },
  {
    id: 2,
    habit: 'What is your education level?',
    key: 'education_level',
    options: EducationLevelData,
  },
  {
    id: 3,
    habit: 'What is your star sign?',
    key: 'star_sign',
    options: StarSignData,
  },
];

export interface YourIntoType {
  id: number;
  name: string;
}

export const YourIntoData: YourIntoType[] = [
  {id: 1, name: '90s Kid'},
  {id: 2, name: 'Harry Potter'},
  {id: 3, name: 'SoundCloud'},
  {id: 4, name: 'Spa'},
  {id: 5, name: 'Self-Care'},
  {id: 6, name: 'Ludo'},
  {id: 7, name: 'Maggi'},
  {id: 8, name: 'Hot Yoga'},
  {id: 9, name: 'Biryani'},
  {id: 10, name: 'Travel Enthusiast'},
  {id: 11, name: 'Gaming Geek'},
  {id: 12, name: 'Coffee Connoisseur'},
  {id: 13, name: 'Bookworm'},
  {id: 14, name: 'Art Lover'},
  {id: 15, name: 'Tech Guru'},
  {id: 16, name: 'Fitness Freak'},
  {id: 17, name: 'Music Festival Junkie'},
  {id: 18, name: 'Film Buff'},
  {id: 19, name: 'Foodie Explorer'},
  {id: 20, name: 'DIY Enthusiast'},
  {id: 21, name: 'Vintage Collector'},
  {id: 22, name: 'Astrology Buff'},
  {id: 23, name: 'Comic Book Nerd'},
  {id: 24, name: 'Board Game Aficionado'},
  {id: 25, name: 'Animal Lover'},
  {id: 26, name: 'Plant Parent'},
  {id: 27, name: 'Photography Enthusiast'},
  {id: 28, name: 'Craft Beer Advocate'},
  {id: 29, name: 'Mindfulness Practitioner'},
  {id: 30, name: 'Fashionista'},
  {id: 31, name: 'History Buff'},
  {id: 32, name: 'Sustainability Champion'},
  {id: 33, name: 'Language Learner'},
  {id: 34, name: 'Star Wars Fanatic'},
  {id: 35, name: 'Wholesome Memer'},
  {id: 36, name: 'Surrealist Dreamer'},
  {id: 37, name: 'Anime Aficionado'},
  {id: 38, name: 'Beach Bum'},
  {id: 39, name: 'Mountain Explorer'},
  {id: 40, name: 'Cooking Maestro'},
  {id: 41, name: 'Vintage Vinyl Collector'},
  {id: 42, name: 'Motorcycle Enthusiast'},
  {id: 43, name: 'Space Enthusiast'},
  {id: 44, name: 'Hiking Enthusiast'},
  {id: 45, name: 'Comic-Con Attendee'},
  {id: 46, name: 'Salsa Dancing Pro'},
  {id: 47, name: 'Board Game Night Host'},
  {id: 48, name: 'Karaoke King/Queen'},
];

export const HomeLookingForData = [
  {
    id: 1,
    title: 'hoping',
    image: CommonImages.HomeHoping,
  },
  {
    id: 2,
    title: 'New Friends',
    image: CommonImages.HomeNewFriends,
  },
  {
    id: 3,
    title: 'Something Casual',
    image: CommonImages.HomeSomethingCasual,
  },
  {
    id: 4,
    title: 'Party Partner',
    image: CommonImages.HomePartyPartner,
  },
  {
    id: 5,
    title: 'Sort Term Relationship',
    image: CommonImages.HomeSortTermRelationship,
  },
  {
    id: 6,
    title: 'Help',
    image: CommonImages.HomeHelp,
  },
];

export default CountryWithCode;

export type ReportReasonType = {
  id: number;
  name: string;
};

export const reportReasons: ReportReasonType[] = [
  {id: 1, name: 'Inappropriate Behavior'},
  {id: 2, name: 'Harassment'},
  {id: 3, name: 'Spam or Scam'},
  {id: 4, name: 'Fake Profile'},
  {id: 5, name: 'Violence or Threats'},
  {id: 6, name: 'Hate Speech or Discrimination'},
  {id: 7, name: 'Nudity or Sexual Content'},
  {id: 8, name: 'Impersonation'},
  {id: 9, name: 'Privacy Violation'},
  {id: 10, name: 'Misinformation'},
  {id: 11, name: 'Bullying'},
  {id: 12, name: 'Other'},
];
