using {employee_capm.db as myempModel} from '../db/employeeodatav4';

// @(path: '/odata/v4/emppersonalsrv') to change the service path, change the value of the path annotation
service empPersonalsrv @(path: '/odata/v4/emppersonalsrv') {
    // enable the edit button in the object page
    // @odata.draft.enabled
    entity empPersonalSet as projection on myempModel.emppersonalData;

    entity empServicetypeVHSet as projection on myempModel.empServicetypeVH;
    entity employeeGenderVHSet as projection on myempModel.employeeGenderVH;
}

// to rename the selection filed names
annotate empPersonalsrv.empPersonalSet with {
    empId          @Common.Label: 'Employee ID';
    empPhoneNumber @Common.Label: 'Contact Number';
    empService     @Common.Label: 'Service Type';
    empgender      @Common.Label: 'Gender';
    empDateOfJoining @Common.Label : 'Date Of Joining';
    // empFirstName   @Common.Label: 'First Name';
    // empLastName    @Common.Label: 'Last Name';
    // empEmail       @Common.Label: 'Email';
};


annotate empPersonalsrv.empPersonalSet with @(UI: {
    LineItem                    : [
        {
            Value: empId,
            Label: 'Employee ID'
        },
        {
            Value: empFirstName,
            Label: 'First Name'
        },
        {
            Value: empLastName,
            Label: 'Last Name'
        },
        {
            Value : empDateOfBirth,
            Label : 'Date of Birth'
        },
        {
            Value : empDateOfJoining,
            Label : 'Date of Joining'
        },
        {
            Value: empEmail,
            Label: 'Email'
        },
        {
            Value: empPhoneNumber,
            Label: 'Contact Number'
        },
        {
            Value: empService,
            Label: 'Service Type'
        },
        {
            Value: empgender,
            Label: 'Gender'
        }
    ],
    SelectionFields             : [
        empId,
        empDateOfJoining,
        empPhoneNumber,
        empService,
        empgender
    ],
     HeaderInfo                  : {
        TypeName      : 'Employee Personal Details',
        TypeNamePlural: 'Employee Personal Details',
        Title         : {Value: empFirstName},
        Description   : {Value: empLastName}
    },
    Facets                      : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Personal Details',
            Target: '@UI.FieldGroup#personalDetails'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Contact Details',
            Target: '@UI.FieldGroup#ContactDetails'
        }
    ],
    FieldGroup #personalDetails: {Data: [
        {Value: empId},
        {Value: empFirstName, Label : 'First Name'},
        {Value: empLastName, Label : 'Last Name'},
        {Value: empService},
        {Value: empgender},
        {Value: empDateOfBirth, Label : 'Date Of Birth'},
        {Value : empDateOfJoining}
    ]},
    FieldGroup #ContactDetails : {Data: [
        {Value: empEmail, Label : 'Email'},
        {Value: empPhoneNumber, Label : 'Contact Number'},
    ]},
   
});

annotate empPersonalsrv.empPersonalSet with {
    empgender @(
        Common.ValueList: {
            CollectionPath: 'employeeGenderVH', //employeeGenderVHSet
            Label : 'Gender',
            Parameters: [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'code',
                    LocalDataProperty : empgender
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty :'text'
                }
            ]
        }
    );
    empService @(
        Common.ValueList :{
            CollectionPath:'empServicetypeVH', //empServicetypeVHSet
            Parameters:[
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : empService,
                    ValueListProperty : 'code'
                },
                {
                    $Type : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'text'
                }
            ]
        }
    )
};

