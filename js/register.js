$(document).ready(function () {
	$('#clearRegistrationForm').click(function () {
		$("#registerForm").trigger("reset");
	})

	// Registration form submission

	$('#submitButton').click(function () {

		localStorage.removeItem("registerFormInputData");

		$("#registerForm").submit();

		if (localStorage.registerFormInputData != null) {
			var registerFormInputData = JSON.parse(localStorage.getItem("registerFormInputData"));
			$.ajax({
				method: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(registerFormInputData),
				url: `${serverUrl}/storeUser`,
			}).done(function (data, statusText, xhrObj) {
				alert("User has been registered successfully");
				if(data.status == 200) {
					localStorage.setItem('_token', data.data.token);
				}
				$("#registerForm").trigger('reset');
				$.mobile.changePage("#homePage");
			}).error(function (xhr) {
				alert("Error: " + JSON.stringify(xhr));
			})

		}
	})

	// Registraion form validation

	$("#registerForm").validate({
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var inputData = {};
			formData.forEach(function (data) {
				inputData[data.name] = data.value;
			})

			localStorage.setItem("registerFormInputData", JSON.stringify(inputData));
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			firstName: {
				required: true,
				validateName: true
			},
			lastName: {
				required: true,
				validateName: true
			},
			phoneNumber: {
				required: false,
				minlength: 10,
				maxlength: 10,
				mobiletxt: true,
				digits: true
			},
			postcode: {
				required: false,
				posttxt: true,
				digits: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			firstName: {
				required: "First name is required field",
			},
			lastName: {
				required: "Last name is required field",
			},
			phoneNumber: {
				required: "Phone number is required",
				digits: "Only digits are allowed"
			},
			postcode: {
				required: "Phone number is required",
				digits: "Only digits are allowed"
			},
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")
			}
		},
	});
})