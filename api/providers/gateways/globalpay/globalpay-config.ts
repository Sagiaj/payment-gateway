export namespace GlobalpayConfig {
  export const GlobalpayTestCards = {
    AUTHENTICATION_SUCCESSFUL: {
        "Card Number": "4263970000005262",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_SUCCESSFUL",
        "ECI*": "05"
    },
    AUTHENTICATION_SUCCESSFUL_NO_METHOD_URL: {
        "Card Number": "4222000006724235",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_SUCCESSFUL - No Method URL",
        "ECI*": "05"
    },
    AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL: {
        "Card Number": "4012001037167778",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL",
        "ECI*": "06"
    },
    AUTHENTICATION_FAILED: {
        "Card Number": "4012001037461114",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_FAILED",
        "ECI*": "07"
    },
    AUTHENTICATION_ISSUER_REJECTED: {
        "Card Number": "4012001038443335",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_ISSUER_REJECTED",
        "ECI*": "07"
    },
    AUTHENTICATION_COULD_NOT_BE_PERFORMED: {
        "Card Number": "4012001037484447",
        "Flow Type": "Frictionless",
        "Transaction Result": "AUTHENTICATION_COULD_NOT_BE_PERFORMED",
        "ECI*": "07"
    },
    CHALLENGE_REQUIRED: {
        "Card Number": "4012001038488884",
        "Flow Type": "Challenge",
        "Transaction Result": "CHALLENGE_REQUIRED",
        "ECI*": "N/A"
    }
  }
  
  export enum GlobalpayTestCardResults {
    AUTHENTICATION_SUCCESSFUL = "AUTHENTICATION_SUCCESSFUL",
    AUTHENTICATION_SUCCESSFUL_NO_METHOD_URL = "AUTHENTICATION_SUCCESSFUL_NO_METHOD_URL",
    AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL = "AUTHENTICATION_ATTEMPTED_BUT_NOT_SUCCESSFUL",
    AUTHENTICATION_FAILED = "AUTHENTICATION_FAILED",
    AUTHENTICATION_ISSUER_REJECTED = "AUTHENTICATION_ISSUER_REJECTED",
    AUTHENTICATION_COULD_NOT_BE_PERFORMED = "AUTHENTICATION_COULD_NOT_BE_PERFORMED",
    CHALLENGE_REQUIRED = "CHALLENGE_REQUIRED"
  };
  
  
  export const GlobalpayDeclinedCards = {
    "4000120000001154": {
        "Card Number": "4000120000001154",
        "Card Type": "Visa",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "4000130000001724": {
        "Card Number": "4000130000001724",
        "Card Type": "Visa",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "4000160000004147": {
        "Card Number": "4000160000004147",
        "Card Type": "Visa",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "4009830000001985": {
        "Card Number": "4009830000001985",
        "Card Type": "Visa",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "4242420000000091": {
        "Card Number": "4242420000000091",
        "Card Type": "Visa",
        "Result": "Declined",
        "Code": "111",
        "Description": "Strong Customer Authentication Required"
    },
    "5114610000004778": {
        "Card Number": "5114610000004778",
        "Card Type": "Mastercard",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "5114630000009791": {
        "Card Number": "5114630000009791",
        "Card Type": "Mastercard",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "5121220000006921": {
        "Card Number": "5121220000006921",
        "Card Type": "Mastercard",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "5135020000005871": {
        "Card Number": "5135020000005871",
        "Card Type": "Mastercard",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "5100000000000131": {
        "Card Number": "5100000000000131",
        "Card Type": "Mastercard",
        "Result": "Declined",
        "Code": "111",
        "Description": "Strong Customer Authentication Required"
    },
    "376525000000010": {
        "Card Number": "376525000000010",
        "Card Type": "American Express",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "375425000000907": {
        "Card Number": "375425000000907",
        "Card Type": "American Express",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "343452000000306": {
        "Card Number": "343452000000306",
        "Card Type": "American Express",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "372349000000852": {
        "Card Number": "372349000000852",
        "Card Type": "American Express",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "374205502001004": {
        "Card Number": "374205502001004",
        "Card Type": "American Express",
        "Result": "Declined",
        "Code": "111",
        "Description": "Strong Customer Authentication Required"
    },
    "36256000000998": {
        "Card Number": "36256000000998",
        "Card Type": "Diners Club",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "36256000000634": {
        "Card Number": "36256000000634",
        "Card Type": "Diners Club",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "38865000000705": {
        "Card Number": "38865000000705",
        "Card Type": "Diners Club",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "30450000000985": {
        "Card Number": "30450000000985",
        "Card Type": "Diners Club",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "6011000000001010": {
        "Card Number": "6011000000001010",
        "Card Type": "Discover",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "6011000000001028": {
        "Card Number": "6011000000001028",
        "Card Type": "Discover",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "6011000000001036": {
        "Card Number": "6011000000001036",
        "Card Type": "Discover",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "6011000000002000": {
        "Card Number": "6011000000002000",
        "Card Type": "Discover",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "3566000000001016": {
        "Card Number": "3566000000001016",
        "Card Type": "JCB",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "3566000000001024": {
        "Card Number": "3566000000001024",
        "Card Type": "JCB",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "3566000000001032": {
        "Card Number": "3566000000001032",
        "Card Type": "JCB",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "3566000000002006": {
        "Card Number": "3566000000002006",
        "Card Type": "JCB",
        "Result": "Declined",
        "Code": "200",
        "Description": "Communication Error"
    },
    "135400000009712": {
        "Card Number": "135400000009712",
        "Card Type": "UATP",
        "Result": "Declined",
        "Code": "101",
        "Description": "Declined by the bank"
    },
    "135400000007633": {
        "Card Number": "135400000007633",
        "Card Type": "UATP",
        "Result": "Declined",
        "Code": "102",
        "Description": "Referral B"
    },
    "135400000000281": {
        "Card Number": "135400000000281",
        "Card Type": "UATP",
        "Result": "Declined",
        "Code": "103",
        "Description": "Referral A - Card reported lost/stolen"
    },
    "135400000005637": {
        "Card Number": "135400000005637",
        "Card Type": "UATP",
        "Result": "Declined",
        "Code": "205",
        "Description": "Communication Error"
    }
  }
  
  export enum GlobalpayTransactionCardStatus {
    "Communication Error" = "200",
    "Declined by the bank" = "101",
    "Referral A - Card reported lost/stolen" = "103",
    "Referral B" = "102",
    "Strong Customer Authentication Required" = "111"
  };  
}
