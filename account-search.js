function parseAccounts() {
  var accounts = document.querySelectorAll("fieldset > .saml-account");

  var accountRoles = [];

  for(var i = 0; i < accounts.length; i++) {
    var account = accounts.item(i);
    var accountName = account.querySelector(".saml-account-name").textContent;
    accountName = accountName.substring(9, accountName.length);

    var accountReg = /(\d{12})/;
    var accountNum = accountName.match(accountReg)[1];

    // Find the roles
    var roles = account.querySelectorAll(".saml-role");
    for(var j = 0; j < roles.length; j++) {
      var roleName = roles.item(j).textContent.trim();
      accountRoles.push({
        "id": `arn:aws:iam::${accountNum}:role/${roleName}`,
        "text": `${accountName} - ${roleName}`,
        "accountNum": accountNum,
        "roleName": roleName,
      });
    }

  }

  return accountRoles;
}


function accountSearch(qry, callback) {
  var accounts = parseAccounts();
  if(qry != "") {
    accounts = accounts.filter(account => account.text.toLowerCase().includes(qry));
  }
  callback(accounts);
}


function decoratePage() {
  $('head').append('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">');

  $('#content').prepend('<input type="text" id="account-search" class="form-control basicAutoComplete" autocomplete="off" style="width: 50%; margin-left: auto; margin-right: auto;" placeholder="Search for role..."><br/><br/>');

  $('#account-search').autoComplete({
    minLength: 2,
    resolver: 'custom',
    events: {
        search: accountSearch
    }
  });

  $('#account-search').on('autocomplete.select', function(evt, item){
    console.log(item);
    // Find the element with the ARN value and select it.
    $(`input[value="${item.id}"]`).prop("checked", true).trigger('click');

    // Submit the form
    $('#saml_form').submit();
  });

  $('#account-search').focus();
}


decoratePage();
