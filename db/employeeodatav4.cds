namespace employee_capm.db;

type empServiceType : String enum{
    inservice = 'SERVICE';
    retired = 'RETIRED';
}

type employeeGender : String enum {
    male = 'MALE';
    female = 'FEMALE';
}

entity emppersonalData {
    key Id : UUID;
    empId : Integer;
    empFirstName : String(50);
    empLastName : String(50);
    empEmail : String(100);
    empPhoneNumber : String(20);
    empDateOfBirth : DateTime;
    empDateOfJoining : DateTime;
    empService : empServiceType;
    empgender : employeeGender;
    famrelation : Composition of many empFamilyMemberData on famrelation.famComposation = $self
}

entity empServicetypeVH {
    key code : String;
    text : String;
}

entity employeeGenderVH {
    key code : String;
    text : String;
}

entity empFamilyMemberData {
    key famId : UUID;
    empId : Integer;
    relation : String(50);
    familyMemberName : String(100);
    familyMemberAge : Integer;
    famComposation : Association to emppersonalData;
}