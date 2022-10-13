define([
  'postmonger'
], function (
  Postmonger
) {
  'use strict';

  var connection = new Postmonger.Session();
  var payload = {};
  var debug = 'true'
  var steps = [{
    "label": "Select type",
    "key": "step1"
  }, {
    "label": "Configure wallet",
    "key": "step2"
  }, {
    "label": "Validate wallet",
    "key": "step3"
  }];

  /*var Method;
  var WalletID;
  var MessagePush;
  var Leveltext;
  var Levelval;
  var FirstNametext;
  var FirstNameval;
  var LastNametext;
  var LastNameval;
  var Phonetext;
  var Phoneval;
  var ContactIDtext;
  var ContactIDval;
  var Balancetext;
  var Balanceval;
  var SerialNumbertext;
  var SerialNumberval;*/

  var currentStep = steps[0].key;
  var ReadyEntry = '';
  connection.on('requestedSchema', onGetSchema);
  connection.trigger('requestSchema');
  connection.on('requestedTriggerEventDefinition', onGetDefinitionModel);
  connection.trigger('requestTriggerEventDefinition');
  $(window).ready(onRender);
  connection.on('initActivity', initialize);
  connection.on('requestedTokens', onGetTokens);
  connection.on('requestedEndpoints', onGetEndpoints);
  connection.on('clickedNext', onClickedNext);
  connection.on('clickedBack', onClickedBack);
  connection.on('gotoStep', onGotoStep);

  //step1
  function onRender() {
    var StepActual = '1'
    if (debug == 'true') {
      console.log(StepActual);
    }

    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');

    $('#Methodinput').change(function () {
      var Method = getMethod();
      connection.trigger('updateButton', {
        button: 'next',
        enabled: Boolean(Method)
      });

      $('#step2 input').attr('Value', '');
      $('#step2 select').find('option[value=""]').prop('selected', true);

      $('.input-data').removeClass("required");

      DisplayFields();

    });

  }

  //step2
  function onGetDefinitionModel(eventDefinitionModel) {
    var StepActual = '2'
    if (debug == 'true') {
      console.log(StepActual);
    }

    if (eventDefinitionModel) {
      var eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
      $('#eventdefinitionkeyinput').attr('Value', eventDefinitionKey);
    }
  }

  //step3
  function onGetSchema(Schema) {
    var Schema = Schema.schema;

    var StepActual = '3'
    if (debug == 'true') {
      console.log(StepActual);
    }

    $('#alert-entry').removeClass("display");
    $('#alert-entry').addClass("hidde");
    var i;
    if (Schema.length > 0) {
      ReadyEntry = 'True'
      for (i = 0; i < Schema.length; i++) {
        var Value;
        var name;
        Value = '{{' + Schema[i].key + '}}';

        var Field = Schema[i].key;
        var a = Field.split(".");
        var j;

        for (j = 0; j < a.length; j++) {
          name = a[2];
        }

        $('#step2 select').append($('<option>', {
          value: Value,
          text: name
        }));

        connection.trigger('ready');

      }
    } else {

      connection.trigger('ready');
      ReadyEntry = 'False'

      $('#alert-entry').removeClass("hidde");
      $('#alert-entry').addClass("display");

      $('input, textarea').attr('readonly', 'readonly');
      $('select').attr('disabled', 'disabled');


    }
  }

  //step4
  function initialize(data) {
    var StepActual = '4'
    if (debug == 'true') {
      console.log(StepActual);
    }
    var Method;

    getData(data);

    showStep(null, 1);

    if ((Method != 'Push' && Method != 'Create' && Method != 'Update') || ReadyEntry == 'False') {

      connection.trigger('updateButton', {
        button: 'next',
        enabled: false
      });

    } else {

      connection.trigger('nextStep');

      $('#step3 .summary').innerHTML += '<h3>' + Method + ' Pass</h3>';
      $('#Methodinput').find('option[value="' + Method + '"]').prop('selected', true);

      ValidateFields(Method, StepActual);

    }

  }

  function onGetTokens(tokens) {
    //authTokens = tokens;
    mc_fuel_token = tokens.fuel2token;
  }

  function onGetEndpoints(endpoints) {
    //mc_fuel_url = endpoints.fuelapiRestHost;
  }

  //step5
  function onClickedNext() {
    var StepActual = '5'
    if (debug == 'true') {
      console.log(StepActual);
    }

    if (currentStep.key === 'step2') {

      $('.input-data').removeClass("required");

      var Method = getMethod();

      ValidateFields(Method, StepActual);

    } else if (currentStep.key === 'step3') {
      save();
    } else {
      connection.trigger('nextStep');
    }
  }

  //step6
  function onClickedBack() {
    var StepActual = '6'
    if (debug == 'true') {
      console.log(StepActual);
    }

    connection.trigger('prevStep');
  }

  //step7
  function onGotoStep(step, data) {
    var StepActual = '7'
    if (debug == 'true') {
      console.log(StepActual);
    }
    var Method;
    showStep(step);

    getData(data);

    DisplayFields();

    $('#Method').html(Method + ' Pass');
    $('#Methodinput').find('option[value="' + Method + '"]').prop('selected', true);

    ValidateFields(Method, StepActual, data);


  }

  //step8
  function showStep(step, stepIndex) {
    var StepActual = '8'
    if (debug == 'true') {
      console.log(StepActual);
    }

    if (stepIndex && !step) {
      step = steps[stepIndex - 1];
    }
    currentStep = step;
    $('.step').hide();
    switch (currentStep.key) {
      case 'step1':
        $('#step1').show();
        connection.trigger('updateButton', {
          button: 'next',
          enabled: Boolean(getMethod())
        });
        connection.trigger('updateButton', {
          button: 'back',
          visible: false
        });
        break;
      case 'step2':
        $('#step2').show();
        connection.trigger('updateButton', {
          button: 'next',
          enabled: 'true'
        });
        connection.trigger('updateButton', {
          button: 'back',
          visible: true
        });
        break;
      case 'step3':
        $('#step3').show();
        connection.trigger('updateButton', {
          button: 'back',
          visible: true
        });
        connection.trigger('updateButton', {
          button: 'next',
          text: 'done',
          visible: true
        });
        break;
    }
  }

  //step9
  function save() {
    var StepActual = '9'
    if (debug == 'true') {
      console.log(StepActual);
    }

    var eventDefinitionKey = geteventDefinitionKey();
    var Method = getMethod();
    var WalletID = getWalletID();
    var MessagePush = getMessagePush();
    var Level = new Array(getLevel(), getLevelvalue());
    var FirstName = new Array(getFirstName(), getFirstNamevalue());
    var LastName = new Array(getLastName(), getLastNamevalue());
    var Phone = new Array(getPhone(), getPhonevalue());
    var ContactID = new Array(getContactID(), getContactIDvalue());
    var Balance = new Array(getBalance(), getBalancevalue());
    var SerialNumber = new Array(getSerialNumber(), getSerialNumbervalue());

    payload.name = getMethod() + 'pass';
    payload['arguments'].execute.inArguments = [{
      "eventDefinitionKey": eventDefinitionKey,
      "Method": Method,
      "WalletID": WalletID,
      "MessagePush": MessagePush,
      "Level": Level,
      "FirstName": FirstName,
      "LastName": LastName,
      "Phone": Phone,
      "ContactID": ContactID,
      "Balance": Balance,
      "SerialNumber": SerialNumber
    }];
    payload['metaData'].isConfigured = true;
    connection.trigger('updateActivity', payload);
  }

  function getMethod() {
    return $('#Methodinput').find('option:selected').attr('value').trim();
  }

  function getWalletID() {
    return $('#WalletIDinput').val();
  }

  function getMessagePush() {
    return $('#MessagePushinput').val();
  }

  function geteventDefinitionKey() {
    return $('#eventdefinitionkeyinput').val();
  }

  function getLevelvalue() {
    return $('#Levelinput').find('option:selected').attr('value').trim();
  }

  function getFirstNamevalue() {
    return $('#FirstNameinput').find('option:selected').attr('value').trim();
  }

  function getLastNamevalue() {
    return $('#LastNameinput').find('option:selected').attr('value').trim();
  }

  function getPhonevalue() {
    return $('#Phoneinput').find('option:selected').attr('value').trim();
  }

  function getContactIDvalue() {
    return $('#ContactIDinput').find('option:selected').attr('value').trim();
  }

  function getBalancevalue() {
    return $('#Balanceinput').find('option:selected').attr('value').trim();
  }

  function getSerialNumbervalue() {
    return $('#SerialNumberinput').find('option:selected').attr('value').trim();
  }

  function getLevel() {
    return $('#Levelinput').find('option:selected').text();
  }

  function getFirstName() {
    return $('#FirstNameinput').find('option:selected').text();
  }

  function getLastName() {
    return $('#LastNameinput').find('option:selected').text();
  }

  function getPhone() {
    return $('#Phoneinput').find('option:selected').text();
  }

  function getContactID() {
    return $('#ContactIDinput').find('option:selected').text();
  }

  function getBalance() {
    return $('#Balanceinput').find('option:selected').text();
  }

  function getSerialNumber() {
    return $('#passSerialNumberinput').find('option:selected').text();
  }

  function SelectFields(Method) {

    $('#WalletIDinput').attr('Value', WalletID;
    $('#Levelinput').find('option[value="' + Levelvalue + '"]').prop('selected', true);
    $('#FirstNameinput').find('option[value="' + FirstNamevalue + '"]').prop('selected', true);
    $('#LastNameinput').find('option[value="' + LastNamevalue + '"]').prop('selected', true);
    $('#Phoneinput').find('option[value="' + Phonevalue + '"]').prop('selected', true);
    $('#ContactIDinput').find('option[value="' + ContactIDvalue + '"]').prop('selected', true);
    $('#Balanceinput').find('option[value="' + Balancevalue + '"]').prop('selected', true);

    if (Method == 'Update' || Method == 'Push') {
      $('#SerialNumberinput').find('option[value="' + SerialNumbervalue + '"]').prop('selected', true);
    }
    if (Method == 'Push') {
      $('#MessagePushinput').attr('Value', MessagePush;
    }
  }

  function WriteSummary(Method) {

    $('#step3 .summary').html('');
    $('#step3 .summary').append('<h3>' + Method + ' Pass</h3>');

    if (getWalletID() != 'Undefined' && getWalletID().length > 0) {
      $('#step3 .summary').append('<p><b>WalletID:</b> ' + getWalletID() + '</p>');
    }
    if (getLevelvalue() != 'Undefined' && getLevelvalue().length > 0) {
      $('#step3 .summary').append('<p><b>Level:</b> {{' + getLevel() + '}}</p>');
    }
    if (getFirstNamevalue() != 'Undefined' && getFirstNamevalue().length > 0) {
      $('#step3 .summary').append('<p><b>Firstname:</b> {{' + getFirstName() + '}}</p>');
    }
    if (getLastNamevalue() != 'Undefined' && getLastNamevalue().length > 0) {
      $('#step3 .summary').append('<p><b>lastName:</b> {{' + getLastName() + '}}</p>');
    }
    if (getPhonevalue() != 'Undefined' && getPhonevalue().length > 0) {
      $('#step3 .summary').append('<p><b>Phone:</b> {{' + getPhone() + '}}</p>');
    }
    if (getContactIDvalue() != 'Undefined' && getContactIDvalue().length > 0) {
      $('#step3 .summary').append('<p><b>ContactId:</b> {{' + getContactID() + '}}</p>');
    }
    if (getBalancevalue() != 'Undefined' && getBalancevalue().length > 0) {
      $('#step3 .summary').append('<p><b>Balance:</b> {{' + getBalance() + '}}</p>');
    }
    if (Method == 'Update' || Method == 'Push') {
      if (getSerialNumbervalue() != 'Undefined' && getSerialNumbervalue().length > 0) {
        $('#step3 .summary').append('<p><b>Serial Number:</b> {{' + getBalance() + '}}</p>');
      }
    }
    if (Method == 'Push') {

      if (getMessagePush() != 'Undefined' && getMessagePush().length > 0) {
        $('#step3 .summary').append('<p><b>Message Push:</b> ' + getMessagePush() + '</p>');
      }
    }
  }

  function FlagFields(Method) {
    if (Method == 'Create') {

      $('.createpass input, .createpass select, .createpass textarea').each(
        function () {
          if ($(this).tagName == 'Select') {
            if (($(this).find('option:selected').attr('value').trim() === 'Undefined' || $(this).find('option:selected').attr('value').trim().length === 0)) {
              $(this).addClass("required");
            }
          } else {
            if (($(this).val() === 'Undefined' || $(this).val().length === 0)) {
              $(this).addClass("required");
            }
          }
        }
      );
    } else if (Method == 'Update') {
      $('.updatepass input, .updatepass select, .updatepass textarea').each(
        function () {
          if ($(this).tagName == 'Select') {
            if (($(this).find('option:selected').attr('value').trim() === 'Undefined' || $(this).find('option:selected').attr('value').trim().length === 0)) {
              $(this).addClass("required");
            }
          } else {
            if (($(this).val() === 'Undefined' || $(this).val().length === 0)) {
              $(this).addClass("required");
            }
          }
        }
      );
    } else if (Method == 'Push') {
      $('.pushpass input, .pushpass select, .pushpass textarea').each(
        function () {
          if ($(this).tagName == 'Select') {
            if (($(this).find('option:selected').attr('value').trim() === 'Undefined' || $(this).find('option:selected').attr('value').trim().length === 0)) {
              $(this).addClass("required");
            }
          } else {
            if (($(this).val() === 'Undefined' || $(this).val().length === 0)) {
              $(this).addClass("required");
            }
          }
        }
      );
    }
  }

  function DisplayFields() {
    var Method = getMethod();
    if (Method == 'Create') {

      $('#Method').html(Method + ' Pass');

      $('.updatepass').removeClass("show");
      $('.pushpass').removeClass("show");
      $('.updatepass').addClass("hidde");
      $('.pushpass').addClass("hidde");
      $('.createpass').removeClass("hidde");
      $('.createpass').addClass("show");

    } else if (Method == 'Update') {

      $('#Method').html(Method + ' Pass');

      $('.createpass').removeClass("show");
      $('.pushpass').removeClass("show");
      $('.createpass').addClass("hidde");
      $('.pushpass').addClass("hidde");
      $('.updatepass').removeClass("hidde");
      $('.updatepass').addClass("show");

    } else if (Method == 'Push') {

      $('#Method').html(Method + ' Message');

      $('.createpass').removeClass("show");
      $('.updatepass').removeClass("show");
      $('.createpass').addClass("hidde");
      $('.updatepass').addClass("hidde");
      $('.pushpass').removeClass("hidde");
      $('.pushpass').addClass("show");

    }
  }

  function getData(data) {

    if (data) {
      payload = data;
    }

    var hasInArguments = Boolean(
      payload['arguments']
      && payload['arguments'].execute
      && payload['arguments'].execute.inArguments
      && payload['arguments'].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

    $.each(inArguments, function (index, inArgument) {

      var Method = inArgument["Method"];
      var WalletID = inArgument["WalletID"];
      var MessagePush = inArgument["MessagePush"];
      var Leveltext = inArgument["Level"][0];
      var Levelval = inArgument["Level"][1];
      var FirstNametext = inArgument["FirstName"][0];
      var FirstNameval = inArgument["FirstName"][1];
      var LastNametext = inArgument["LastName"][0];
      var LastNameval = inArgument["LastName"][1];
      var Phonetext = inArgument["Phone"][0];
      var Phoneval = inArgument["Phone"][1];
      var ContactIDtext = inArgument["ContactID"][0];
      var ContactIDval = inArgument["ContactID"][1];
      var Balancetext = inArgument["Balance"][0];
      var Balanceval = inArgument["Balance"][1];
      var SerialNumbertext = inArgument["SerialNumber"][0];
      var SerialNumberval = inArgument["SerialNumber"][1];

    });

  }

  function ValidateFields(Method, StepActual, data) {

    if (Method == 'Create') {

      if (StepActual == '5') {
        if (($('.createpass input[type=text]').val() === 'Undefined' || $('.createpass input[type=text]').val().length === 0) || ($('.createpass select').find('option:selected').attr('value').trim() === 'Undefined' || $('.createpass select').find('option:selected').attr('value').trim().length === 0)) {
          FlagFields(Method);
        } else {
          WriteSummary(Method);
          connection.trigger('nextStep');
        }
      } else if (StepActual == '4' || StepActual == '7') {
        getData(data);
        if ((FirstNameval === 'Undefined' || FirstNameval.length === 0) || (LastNameval === 'Undefined' || LastNameval.length === 0) || (Levelval === 'Undefined' || Levelval.length === 0) || (ContactIDval === 'Undefined' || ContactIDval.length === 0) || (Balanceval === 'Undefined' || Balanceval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {} else {
          SelectFields(Method);
          WriteSummary(Method);
          if (StepActual == '7') {
            connection.trigger('ready');
          } else {
            connection.trigger('nextStep');
          }
        }
      }

    } else if (Method == 'Update') {

      if (StepActual == '5') {
        if (($('.updatepass input[type=text]').val() === 'Undefined' || $('.updatepass input[type=text]').val().length === 0) || ($('.updatepass select').find('option:selected').attr('value').trim() === 'Undefined' || $('.updatepass select').find('option:selected').attr('value').trim().length === 0)) {
          FlagFields(Method);
        } else {
          WriteSummary(Method);
          connection.trigger('nextStep');
        }
      } else if (StepActual == '4' || StepActual == '7') {
        getData(data);
        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {} else {
          SelectFields(Method);
          WriteSummary(Method);
          if (StepActual == '7') {
            connection.trigger('ready');
          } else {
            connection.trigger('nextStep');
          }
        }
      }

    } else if (Method == 'Push') {

      if (StepActual == '5') {
        if (($('.pushpass textarea').val() === 'Undefined' || $('.pushpass textarea').val().length === 0) || ($('.pushpass select').find('option:selected').attr('value').trim() === 'Undefined' || $('.pushpass select').find('option:selected').attr('value').trim().length === 0)) {
          FlagFields(Method);
        } else {
          WriteSummary(Method);
          connection.trigger('nextStep');
        }
      } else if (StepActual == '4' || StepActual == '7') {
        getData(data);
        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (MessagePush === 'Undefined' || MessagePush.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {} else {
          SelectFields(Method);
          WriteSummary(Method);

          if (StepActual == '7') {
            connection.trigger('ready');
          } else {
            connection.trigger('nextStep');
          }
        }
      }

    }
  }

});
