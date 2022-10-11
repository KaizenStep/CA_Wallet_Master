define([
  'postmonger'
], function (
  Postmonger
) {
  'use strict';

  var connection = new Postmonger.Session();
  var payload = {};
  var steps = [ // initialize to the same value as what's set in config.json for consistency
    {
      "label": "Select type",
      "key": "step1"
    }, {
      "label": "Configure wallet",
      "key": "step2"
    }, {
      "label": "Validate wallet",
      "key": "step3"
    }
  ];

  var currentStep = steps[0].key;
  var authTokens = '';
  var eventDefinitionKey = '';
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

  function onRender() {
    // JB will respond the first time 'ready' is called with 'initActivity'

    connection.trigger('requestTokens');
    connection.trigger('requestEndpoints');
    // Disable the next button if a value isn't selected
    $('#Methodinput').change(function () {
      var Method = getMethod();
      connection.trigger('updateButton', {
        button: 'next',
        enabled: Boolean(Method)
      });


      $('#WalletIDinput').removeClass("required");
      $('#FirstNameinput').removeClass("required");
      $('#LastNameinput').removeClass("required");
      $('#Phoneinput').removeClass("required");
      $('#Levelinput').removeClass("required");
      $('#ContactIDinput').removeClass("required");
      $('#Balanceinput').removeClass("required");
      $('#SerialNumberinput').removeClass("required");
      $('#MessagePushinput').removeClass("required");

      if (Method == 'Create') {

        $('#Method').html(Method + ' Pass');

        $('.createpass').removeClass("hidde");
        $('.createupdatepass').removeClass("hidde");
        $('.createupdatepushpass').removeClass("hidde");
        $('.updatepushpass').removeClass("show");
        $('.pushpass').removeClass("show");

        $('.createpass').addClass("show");
        $('.createupdatepass').addClass("show");
        $('.createupdatepushpass').addClass("show");
        $('.updatepushpass').addClass("hidde");
        $('.pushpass').addClass("hidde");

      } else if (Method == 'Update') {

        $('#Method').html(Method + ' Pass');

        $('.createpass').removeClass("show");
        $('.createupdatepass').removeClass("hidde");
        $('.createupdatepushpass').removeClass("hidde");
        $('.updatepushpass').removeClass("hidde");
        $('.pushpass').removeClass("show");

        $('.createpass').addClass("hidde");
        $('.createupdatepass').addClass("show");
        $('.createupdatepushpass').addClass("show");
        $('.updatepushpass').addClass("show");
        $('.pushpass').addClass("hidde");

      } else if (Method == 'Push') {

        $('#Method').html(Method + ' Message');

        $('.createpass').removeClass("show");
        $('.createupdatepass').removeClass("show");
        $('.createupdatepushpass').removeClass("hidde");
        $('.updatepushpass').removeClass("hidde");
        $('.pushpass').removeClass("hidde");

        $('.createpass').addClass("hidde");
        $('.createupdatepass').addClass("hidde");
        $('.createupdatepushpass').addClass("show");
        $('.updatepushpass').addClass("show");
        $('.pushpass').addClass("show");

      }

    });

  }

  function onGetDefinitionModel(eventDefinitionModel) {
    console.log(eventDefinitionModel);
    if (eventDefinitionModel) {
      var eventDefinitionKey = eventDefinitionModel.eventDefinitionKey;
      $('#eventdefinitionkeyinput').attr('Value', eventDefinitionKey);
    }
  }

  function onGetSchema(Schema) {
    var Schema = Schema.schema;
    console.log('schema: ' + JSON.stringify(Schema));
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
      console.log("No entry event configured");
      connection.trigger('ready');
      ReadyEntry = 'False'

      $('#alert-entry').removeClass("hidde");
      $('#alert-entry').addClass("display");

      $('input, textarea').attr('readonly', 'readonly');
      $('select').attr('disabled', 'disabled');



    }
  }


  function initialize(data) {
    if (data) {
      payload = data;
    }
    var Method;
    var WalletID;
    var MessagePush;
    var Leveltext;
    var FirstNametext;
    var LastNametext;
    var Phonetext;
    var ContactIDtext;
    var SerialNumbertext;
    var Balancetext;
    var Levelval;
    var FirstNameval;
    var LastNameval;
    var Phoneval;
    var ContactIDval;
    var Balanceval;
    var SerialNumberval;
    var hasInArguments = Boolean(
      payload['arguments'] &&
      payload['arguments'].execute &&
      payload['arguments'].execute.inArguments &&
      payload['arguments'].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {
          
          console.log(FirstName.get(0));

        if (key === 'Method') {
          Method = val;
        }
        if (key === 'WalletID') {
          WalletID = val;
        }
        if (key === 'MessagePush') {
          MessagePush = val;
        }
        if (key === 'Level') {
          Leveltext = val[0];
          Levelval = val[1];
        }
        if (key === 'FirstName') {
          FirstNametext = val[0];
          FirstNameval = val[1];
        }
        if (key === 'LastName') {
          LastNametext = val[0];
          LastNameval = val[1];
        }
        if (key === 'Phone') {
          Phonetext = val[0];
          Phoneval = val[1];
        }
        if (key === 'ContactID') {
          ContactIDtext = val[0];
          ContactIDval = val[1];
        }
        if (key === 'Balance') {
          Balancetext = val[0];
          Balanceval = val[1];
        }
        if (key === 'SerialNumber') {
          SerialNumbertext = val[0];
          SerialNumberval = val[1];
        }
      });
    });

    showStep(null, 1);
    console.log('Entry event ready: ' + ReadyEntry);

    // If there is no Method selected, disable the next button
    if ((Method != 'Push' && Method != 'Create' && Method != 'Update') || ReadyEntry == 'False') {
      console.log('step1');
      connection.trigger('updateButton', {
        button: 'next',
        enabled: false
      });

      // If there is a Method, skip to the summary step 
      // rehacer!!!!!!
    } else {
      connection.trigger('nextStep');

      $('#Method').html(Method + ' Pass');
      $('#Methodinput').find('option[value="' + Method + '"]').attr('selected', 'selected');

      if (Method == 'Create') {

        if ((FirstNameval === 'Undefined' || FirstNameval.length === 0) || (LastNameval === 'Undefined' || LastNameval.length === 0) || (Levelval === 'Undefined' || Levelval.length === 0) || (ContactIDval === 'Undefined' || ContactIDval.length === 0) || (Balanceval === 'Undefined' || Balanceval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

        } else {

          $('#WalletIDinput').attr('Value', WalletID);
          $('#Levelinput').find('option[value="' + Levelval + '"]').attr('selected', 'selected');
          $('#FirstNameinput').find('option[value="' + FirstNameval + '"]').attr('selected', 'selected');
          $('#LastNameinput').find('option[value="' + LastNameval + '"]').attr('selected', 'selected');
          $('#Phoneinput').find('option[value="' + Phoneval + '"]').attr('selected', 'selected');
          $('#ContactIDinput').find('option[value="' + ContactIDval + '"]').attr('selected', 'selected');
          $('#Balanceinput').find('option[value="' + Balanceval + '"]').attr('selected', 'selected');

          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (Levelval != 'Undefined' && Levelval.length > 0) {
            $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
          }
          if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
            $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
          }
          if (LastNameval != 'Undefined' && LastNameval.length > 0) {
            $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
          }
          if (Phoneval != 'Undefined' && Phoneval.length > 0) {
            $('#Phone').html('<b>Phone:</b> {{' + Phonetext + '}}');
          }
          if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
            $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
          }
          if (Balanceval != 'Undefined' && Balanceval.length > 0) {
            $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
          }
          connection.trigger('nextStep');
        }

      } else if (Method == 'Update') {

        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

        } else {

          $('#WalletIDinput').attr('Value', WalletID);
          $('#Levelinput').find('option[value="' + Levelval + '"]').attr('selected', 'selected');
          $('#FirstNameinput').find('option[value="' + FirstNameval + '"]').attr('selected', 'selected');
          $('#LastNameinput').find('option[value="' + LastNameval + '"]').attr('selected', 'selected');
          $('#Phoneinput').find('option[value="' + Phoneval + '"]').attr('selected', 'selected');
          $('#ContactIDinput').find('option[value="' + ContactIDval + '"]').attr('selected', 'selected');
          $('#Balanceinput').find('option[value="' + Balanceval + '"]').attr('selected', 'selected');
          $('#SerialNumberinput').find('option[value="' + SerialNumberval + '"]').attr('selected', 'selected');

          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (Levelval != 'Undefined' && Levelval.length > 0) {
            $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
          }
          if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
            $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
          }
          if (LastNameval != 'Undefined' && LastNameval.length > 0) {
            $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
          }
          if (Phoneval != 'Undefined' && Phoneval.length > 0) {
            $('#Phone').html('<b>Phone:</b> {{' + Phonetext + '}}');
          }
          if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
            $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
          }
          if (Balanceval != 'Undefined' && Balanceval.length > 0) {
            $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
          }
          if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
            $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
          }
          connection.trigger('nextStep');
        }

      } else if (Method == 'Push') {

        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (MessagePush === 'Undefined' || MessagePush.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

        } else {

          $('#WalletIDinput').attr('Value', WalletID);
          $('#MessagePushinput').attr('Value', MessagePush);
          $('#SerialNumberinput').find('option[value="' + SerialNumberval + '"]').attr('selected', 'selected');

          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (MessagePush != 'Undefined' && MessagePush.length > 0) {
            $('#MessagePush').html('<b>Message Push:</b> ' + MessagePush);
          }
          if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
            $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
          }
          connection.trigger('nextStep');
        }

      }

    }


  }

  var mc_fuel_token;
  var mc_fuel_url;

  function onGetTokens(tokens) {
    console.log(tokens);
    authTokens = tokens;
    mc_fuel_token = tokens.fuel2token;

    console.log(mc_fuel_token);
    console.log(mc_fuel_url);
 
  }

  function onGetEndpoints(endpoints) {
    console.log(endpoints);
    mc_fuel_url = endpoints.fuelapiRestHost;
  }


  function onClickedNext() {
    if (currentStep.key === 'step2') {
      $('#WalletIDinput').removeClass("required");
      $('#FirstNameinput').removeClass("required");
      $('#LastNameinput').removeClass("required");
      $('#Phoneinput').removeClass("required");
      $('#Levelinput').removeClass("required");
      $('#ContactIDinput').removeClass("required");
      $('#Balanceinput').removeClass("required");
      $('#SerialNumberinput').removeClass("required");
      $('#MessagePushinput').removeClass("required");

      var WalletID = $('#WalletIDinput').val();

      var MessagePush = $('#MessagePushinput').val();

      var Levelval = $('#Levelinput').find('option:selected').attr('value').trim();
      var Leveltext = $('#Levelinput').find('option:selected').text();

      var FirstNameval = $('#FirstNameinput').find('option:selected').attr('value').trim();
      var FirstNametext = $('#FirstNameinput').find('option:selected').text();

      var LastNameval = $('#LastNameinput').find('option:selected').attr('value').trim();
      var LastNametext = $('#LastNameinput').find('option:selected').text();

      var Phoneval = $('#Phoneinput').find('option:selected').attr('value').trim();
      var Phonetext = $('#Phoneinput').find('option:selected').text();

      var ContactIDval = $('#ContactIDinput').find('option:selected').attr('value').trim();
      var ContactIDtext = $('#ContactIDinput').find('option:selected').text();

      var Balanceval = $('#Balanceinput').find('option:selected').attr('value').trim();
      var Balancetext = $('#Balanceinput').find('option:selected').text();

      var SerialNumberval = $('#SerialNumberinput').find('option:selected').attr('value').trim();
      var SerialNumbertext = $('#SerialNumberinput').find('option:selected').text();

      var Method = getMethod();

      if (Method == 'Create') {

        if ((FirstNameval === 'Undefined' || FirstNameval.length === 0) || (LastNameval === 'Undefined' || LastNameval.length === 0) || (Levelval === 'Undefined' || Levelval.length === 0) || (ContactIDval === 'Undefined' || ContactIDval.length === 0) || (Balanceval === 'Undefined' || Balanceval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

          if ((FirstNameval === 'Undefined' || FirstNameval.length === 0)) {
            $('#FirstNameinput').addClass("required");
          }
          if ((LastNameval === 'Undefined' || LastNameval.length === 0)) {
            $('#LastNameinput').addClass("required");
          }
          if ((Phoneval === 'Undefined' || Phoneval.length === 0)) {
            $('#Phoneinput').addClass("required");
          }
          if ((Levelval === 'Undefined' || Levelval.length === 0)) {
            $('#Levelinput').addClass("required");
          }
          if ((ContactIDval === 'Undefined' || ContactIDval.length === 0)) {
            $('#ContactIDinput').addClass("required");
          }
          if ((Balanceval === 'Undefined' || Balanceval.length === 0)) {
            $('#Balanceinput').addClass("required");
          }
          if ((WalletID === 'Undefined' || WalletID.length === 0)) {
            $('#WalletIDinput').addClass("required");
          }

        } else {
          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (Levelval != 'Undefined' && Levelval.length > 0) {
            $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
          }
          if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
            $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
          }
          if (LastNameval != 'Undefined' && LastNameval.length > 0) {
            $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
          }
          if (Phoneval != 'Undefined' && Phoneval.length > 0) {
            $('#Phone').html('<b>Phone:</b> {{' + LastNametext + '}}');
          }
          if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
            $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
          }
          if (Balanceval != 'Undefined' && Balanceval.length > 0) {
            $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
          }
          connection.trigger('nextStep');
        }

      } else if (Method == 'Update') {

        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

          if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0)) {
            $('#SerialNumberinput').addClass("required");
          }
          if ((WalletID === 'Undefined' || WalletID.length === 0)) {
            $('#WalletIDinput').addClass("required");
          }

        } else {
          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (Levelval != 'Undefined' && Levelval.length > 0) {
            $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
          }
          if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
            $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
          }
          if (LastNameval != 'Undefined' && LastNameval.length > 0) {
            $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
          }
          if (Phoneval != 'Undefined' && Phoneval.length > 0) {
            $('#Phone').html('<b>Phone:</b> {{' + Phonetext + '}}');
          }
          if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
            $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
          }
          if (Balanceval != 'Undefined' && Balanceval.length > 0) {
            $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
          }
          if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
            $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
          }
          connection.trigger('nextStep');
        }

      } else if (Method == 'Push') {

        if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (MessagePush === 'Undefined' || MessagePush.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

          if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0)) {
            $('#SerialNumberinput').addClass("required");
          }
          if ((MessagePush === 'Undefined' || MessagePush.length === 0)) {
            $('#MessagePushinput').addClass("required");
          }
          if ((WalletID === 'Undefined' || WalletID.length === 0)) {
            $('#WalletIDinput').addClass("required");
          }

        } else {
          if (WalletID != 'Undefined' && WalletID.length > 0) {
            $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
          }
          if (MessagePush != 'Undefined' && MessagePush.length > 0) {
            $('#MessagePush').html('<b>Message Push:</b> ' + MessagePush);
          }
          if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
            $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
          }
          connection.trigger('nextStep');
        }

      }

    } else if (currentStep.key === 'step3') {
      save();
    } else {
      connection.trigger('nextStep');
    }
  }

  function onClickedBack() {
    connection.trigger('prevStep');
  }

  function onGotoStep(step, data) {
    showStep(step);

    if (data) {
      payload = data;
    }
    var Method;
    var WalletID;
    var MessagePush;
    var Leveltext;
    var FirstNametext;
    var LastNametext;
    var Phonetext;
    var ContactIDtext;
    var SerialNumbertext;
    var Balancetext;
    var Levelval;
    var FirstNameval;
    var LastNameval;
    var Phoneval;
    var ContactIDval;
    var Balanceval;
    var SerialNumberval;
    var hasInArguments = Boolean(
      payload['arguments'] &&
      payload['arguments'].execute &&
      payload['arguments'].execute.inArguments &&
      payload['arguments'].execute.inArguments.length > 0
    );

    var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

    $.each(inArguments, function (index, inArgument) {
      $.each(inArgument, function (key, val) {

        if (key === 'Method') {
          Method = val;
        }
        if (key === 'WalletID') {
          WalletID = val;
        }
        if (key === 'MessagePush') {
          MessagePush = val;
        }
        if (key === 'Level') {
          Leveltext = val[0];
          Levelval = val[1];
        }
        if (key === 'FirstName') {
          FirstNametext = val[0];
          FirstNameval = val[1];
        }
        if (key === 'LastName') {
          LastNametext = val[0];
          LastNameval = val[1];
        }
        if (key === 'Phone') {
          Phonetext = val[0];
          Phoneval = val[1];
        }
        if (key === 'ContactID') {
          ContactIDtext = val[0];
          ContactIDval = val[1];
        }
        if (key === 'Balance') {
          Balancetext = val[0];
          Balanceval = val[1];
        }
        if (key === 'SerialNumber') {
          SerialNumbertext = val[0];
          SerialNumberval = val[1];
        }
      });
    });

    $('#Method').html(Method + ' Pass');
    $('#Methodinput').find('option[value="' + Method + '"]').attr('selected', 'selected');

    if (Method == 'Create') {

      $('.createpass').removeClass("hidde");
      $('.createupdatepass').removeClass("hidde");
      $('.createupdatepushpass').removeClass("hidde");
      $('.updatepushpass').removeClass("show");
      $('.pushpass').removeClass("show");

      $('.createpass').addClass("show");
      $('.createupdatepass').addClass("show");
      $('.createupdatepushpass').addClass("show");
      $('.updatepushpass').addClass("hidde");
      $('.pushpass').addClass("hidde");

    } else if (Method == 'Update') {

      $('.createpass').removeClass("show");
      $('.createupdatepass').removeClass("hidde");
      $('.createupdatepushpass').removeClass("hidde");
      $('.updatepushpass').removeClass("hidde");
      $('.pushpass').removeClass("show");

      $('.createpass').addClass("hidde");
      $('.createupdatepass').addClass("show");
      $('.createupdatepushpass').addClass("show");
      $('.updatepushpass').addClass("show");
      $('.pushpass').addClass("hidde");

    } else if (Method == 'Push') {

      $('.createpass').removeClass("show");
      $('.createupdatepass').removeClass("show");
      $('.createupdatepushpass').removeClass("hidde");
      $('.updatepushpass').removeClass("hidde");
      $('.pushpass').removeClass("hidde");

      $('.createpass').addClass("hidde");
      $('.createupdatepass').addClass("hidde");
      $('.createupdatepushpass').addClass("show");
      $('.updatepushpass').addClass("show");
      $('.pushpass').addClass("show");

    }

    if (Method == 'Create') {

      if ((FirstNameval === 'Undefined' || FirstNameval.length === 0) || (LastNameval === 'Undefined' || LastNameval.length === 0) || (Levelval === 'Undefined' || Levelval.length === 0) || (ContactIDval === 'Undefined' || ContactIDval.length === 0) || (Balanceval === 'Undefined' || Balanceval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

      } else {

        $('#WalletIDinput').attr('Value', WalletID);
        $('#Levelinput').find('option[value="' + Levelval + '"]').attr('selected', 'selected');
        $('#FirstNameinput').find('option[value="' + FirstNameval + '"]').attr('selected', 'selected');
        $('#LastNameinput').find('option[value="' + LastNameval + '"]').attr('selected', 'selected');
        $('#Phoneinput').find('option[value="' + Phoneval + '"]').attr('selected', 'selected');
        $('#ContactIDinput').find('option[value="' + ContactIDval + '"]').attr('selected', 'selected');
        $('#Balanceinput').find('option[value="' + Balanceval + '"]').attr('selected', 'selected');

        if (WalletID != 'Undefined' && WalletID.length > 0) {
          $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
        }
        if (Levelval != 'Undefined' && Levelval.length > 0) {
          $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
        }
        if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
          $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
        }
        if (LastNameval != 'Undefined' && LastNameval.length > 0) {
          $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
        }
        if (Phoneval != 'Undefined' && Phoneval.length > 0) {
          $('#Phone').html('<b>Phone:</b> {{' + Phonetext + '}}');
        }
        if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
          $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
        }
        if (Balanceval != 'Undefined' && Balanceval.length > 0) {
          $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
        }
        connection.trigger('ready');
      }

    } else if (Method == 'Update') {

      if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

      } else {

        $('#WalletIDinput').attr('Value', WalletID);
        $('#Levelinput').find('option[value="' + Levelval + '"]').attr('selected', 'selected');
        $('#FirstNameinput').find('option[value="' + FirstNameval + '"]').attr('selected', 'selected');
        $('#LastNameinput').find('option[value="' + LastNameval + '"]').attr('selected', 'selected');
        $('#Phoneinput').find('option[value="' + Phoneval + '"]').attr('selected', 'selected');
        $('#ContactIDinput').find('option[value="' + ContactIDval + '"]').attr('selected', 'selected');
        $('#Balanceinput').find('option[value="' + Balanceval + '"]').attr('selected', 'selected');
        $('#SerialNumberinput').find('option[value="' + SerialNumberval + '"]').attr('selected', 'selected');

        if (WalletID != 'Undefined' && WalletID.length > 0) {
          $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
        }
        if (Levelval != 'Undefined' && Levelval.length > 0) {
          $('#Level').html('<b>Level:</b> {{' + Leveltext + '}}');
        }
        if (FirstNameval != 'Undefined' && FirstNameval.length > 0) {
          $('#FirstName').html('<b>FirstName:</b> {{' + FirstNametext + '}}');
        }
        if (LastNameval != 'Undefined' && LastNameval.length > 0) {
          $('#LastName').html('<b>LastName:</b> {{' + LastNametext + '}}');
        }
        if (Phoneval != 'Undefined' && Phoneval.length > 0) {
          $('#Phone').html('<b>Phone:</b> {{' + Phonetext + '}}');
        }
        if (ContactIDval != 'Undefined' && ContactIDval.length > 0) {
          $('#ContactID').html('<b>ContactID:</b> {{' + ContactIDtext + '}}');
        }
        if (Balanceval != 'Undefined' && Balanceval.length > 0) {
          $('#Balance').html('<b>Balance:</b> {{' + Balancetext + '}}');
        }
        if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
          $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
        }
        connection.trigger('ready');
      }

    } else if (Method == 'Push') {

      if ((SerialNumberval === 'Undefined' || SerialNumberval.length === 0) || (MessagePush === 'Undefined' || MessagePush.length === 0) || (WalletID === 'Undefined' || WalletID.length === 0)) {

      } else {

        $('#WalletIDinput').attr('Value', WalletID);
        $('#MessagePushinput').attr('Value', MessagePush);
        $('#SerialNumberinput').find('option[value="' + SerialNumberval + '"]').attr('selected', 'selected');

        if (WalletID != 'Undefined' && WalletID.length > 0) {
          $('#WalletID').html('<b>WalletID:</b> ' + WalletID);
        }
        if (MessagePush != 'Undefined' && MessagePush.length > 0) {
          $('#MessagePush').html('<b>Message Push:</b> ' + MessagePush);
        }
        if (SerialNumberval != 'Undefined' && SerialNumberval.length > 0) {
          $('#SerialNumber').html('<b>Serial Number:</b> {{' + SerialNumbertext + '}}');
        }
        connection.trigger('ready');
      }

    }



  }

  function showStep(step, stepIndex) {

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
          enabled: Boolean(getMethod())
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

  function save() {
    var eventDefinitionKey = $('#eventdefinitionkeyinput').val();
    var nameCA = $('#Methodinput').find('option:selected').html();
    var Method = getMethod();
    var WalletID = $('#WalletIDinput').val();
    var MessagePush = $('#MessagePushinput').val();
    var Level = new Array(getLevel(), getLevelvalue());
    var FirstName = new Array(getFirstName(), getFirstNamevalue());
    var LastName = new Array(getLastName(), getLastNamevalue());
    var Phone = new Array(getPhone(), getPhonevalue());
    var ContactID = new Array(getContactID(), getContactIDvalue());
    var Balance = new Array(getBalance(), getBalancevalue());
    var SerialNumber = new Array(getSerialNumber(), getSerialNumbervalue());

    console.log(Method);

    payload.name = nameCA;
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

});
