$(document).ready(function() {
     //HIDING AND SHOWING DEPARTMeNT WHEN CHOOSING DOCTOR
	$('#role').change(function () {
		var role = $('#role').val()
		if(role === '2' || role === '3'){
			$('#department').show()
		}else{
			$('#department').hide()
		}
    })

    //SENDING APPOINTMENT ID
    $('.btn-app').click(function (event) {
        let app_id = $(this).attr('id')
        console.log(app_id)
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/takeup-appointment',
            data: {
                app_id: app_id
            },
            success:function (data) {
                location.reload()
            }
        })
    })

    //CLICKING PAID MONEY
    $('.pay').click(function (event) {
        let patientId = $(this).attr('name')
        let regamount = $(this).attr('value')
        event.preventDefault()
        var accept = window.confirm("Are you sure patient has paid?");
        if(accept){
            $.ajax({
                type: 'POST',
                url: '/accounts',
                data: {
                    patientId: patientId,
                    regamount: regamount
                },
                success:function (data) {
                    location.reload()
                }
            })
           
        }else{
            window.close()
        }
    })

    //CLICKING PAID FOR LAB
    $('.labpay').click(function (event) {
        let consultationId = $(this).attr('name')
        let labamount = $(this).attr('value')
        event.preventDefault()
        var confirm = window.confirm("Are you sure patient has paid?");
        if(confirm){
            $.ajax({
                type: 'POST',
                url: '/lab-test-payment',
                data: {
                    consultationId: consultationId,
                    labamount: labamount
                },
                success:function (data) {
                    location.reload()
                }
            })
            
        }else{
            window.close()
        }
    })

    //CLICKING PAID FOR DRUGS
    $('.drugpay').click(function (event) {
        let pharmId = $(this).attr('name')
        let amount = $(this).attr('value')
        event.preventDefault()
        var result = window.confirm("Are you sure patient has paid?");
        if(result){
            $.ajax({
                type: 'POST',
                url: '/pharmacy-payment',
                data: {
                    pharmId: pharmId,
                    amount: amount
                },
                success:function (data) {
                    location.reload()
                }
            })
            
        }else{
            window.close()
        }
    })

    //CLICKING PRESCRIBED BUTTON
    $('.paid').click(function (event) {
        let prescribe = $(this).attr('id')
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/prescribed',
            data: {
                prescribe: prescribe
            },
            success:function (data) {
                location.reload()
            }
        })
    })

    //CLICKING PRESCRIBED BUTTON
    $('.seedoctor').click(function (event) {
        let seen = $(this).attr('name')
        console.log(seen)
        event.preventDefault()
        let checked = window.confirm('Send patient to see the doctor?')
        if(checked){
            $.ajax({
                type: 'POST',
                url: '/see-doctor',
                data: {
                    seen: seen
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
    })
    

    //CLICKING FINISHED BUTTON
    $('.finish').click(function (event) {
        let test = $(this).attr('id')
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/labtest-finish',
            data: {
                test: test
            },
            success:function (data) {
                location.reload()
            }
        })
    })

    //CLICKING APPROVED BUTTON
    $('#approve').click(function (event) {
        let approve = $(this).attr('value')
        event.preventDefault()
        var answer = window.confirm("Are you sure you want to approve?");
        if(answer){
            $.ajax({
                type: 'POST',
                url: '/approve-request',
                data: {
                    approve: approve
                },
                success:function (data) {
                    location.reload()
                }
            })
        }else{
            window.close()
        }
        
    })

    $('#example-1').multifield();
    $('#form-show').multifield();


     //CLICKING DECLINED BUTTON
     $('#decline').click(function (event) {
        let decline = $(this).attr('value')
        event.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/decline-request',
            data: {
                decline: decline
            },
            success:function (data) {
                location.reload()
            }
        })
    })

    //APPROVING BILLING PAYMENT
    $('.billingpay').click(function (event) {
        let approve = $(this).attr('id')
        event.preventDefault()
         let response = window.confirm("Are you sure you want to approve?");
         if(response){
            $.ajax({
                type: 'POST',
                url: '/approve-billing',
                data: {
                    approve: approve
                },
                success:function (data) {
                    location.reload()
                }
            })
         }else{
             window.close()
         }
    })

    // $('.drugger').click(function (event) {
    //     const consultId = $(this).attr('id')
    //     console.log(consultId)
    //     $.post('/get-drugs-prescription', { consultId: consultId })
    //     .done(function(data) {
    //         console.log(data)
            
    //     })
    // })

    


    //Getting the cardtype
    $('#cardtype').change(function () {
        let cardtype = $('#cardtype').val()
        if(cardtype === "Family"){
            $('#num').show()
            $('.content').show()
        }else{
            $('#num').hide()
            $('.content').hide()
        }
    })

    let numberoffamily = $('#numboffamily').val()
    

    //Calculating the Purcahse cost
    $('#sale_price').change(function () {
        let salePrice = $('#sale_price').val()
        let quantity = $('#quantity').val()
        var totalCost = salePrice * quantity
        $('#cost').val(totalCost)
    })

    //Calculating the Selling cost
    $('#sell_price').change(function () {
        let sellPrice = $('#sell_price').val()
        let quantity = $('#quantity').val()
        var totalincome = sellPrice * quantity
        $('#income').val(totalincome)
    })

    $('#by').change(function () {
        var itemID = new Date();
        console.log(itemID)
        $('#dateReceived').val(itemID.toDateString())
    })

    //Calculating the BMI
    $('#height').change(function () {
        let weight = $('#weight').val()
        let height = $('#height').val()
        let bmi = weight/(height**2)
        $('#bmi').val(bmi)
    })

    //Checking if password is equal to confirm password
    $('#confirmpassword').change(function () {
        let newpassword = $('#newpassword').val()
        let confirmpassword = $('#confirmpassword').val()
        if(newpassword != confirmpassword){
            $('#save').prop('disabled', true)
            $('#message').addClass('color-message').html('Confirm Password not same with New Password')
        }else{
            $('#save').prop('disabled', false)
            $('#message').removeClass('color-message').html('')
        }
    })

    
    //DISPLAYING HMOS
    $('#retain').change(function () {
        var retain = $('#retain').val();
        var amount1 = $('#registration1').val()
        var amount2 = $('#registration2').val()
        var payment1 = $('#consultation1').val()
        var payment2 = $('#consultation2').val()
        if(retain === 'Yes'){
            $('#retainershipname').show()
            let newAmount1 = amount1 * 0.1
            let newAmount2 = amount2 * 0.1
            let newPayment1 = payment1 * 0.1
            let newPayment2 = payment2 * 0.1
            //REGISTRATION
            $('#registration1').val(newAmount1)
            $('#regis1').html(newAmount1)
            $('#registration2').val(newAmount2)
            $('#regis2').html(newAmount2)

            //CONSULTATION
            $('#consultation1').val(newPayment1)
            $('#consult1').html(newPayment1)
            $('#consultation2').val(newPayment2)
            $('#consult2').html(newPayment2)

        }else{
            $('#retainershipname').hide()
            $('#hmoname').hide()
            $('#patientId').hide()
            $('#dependants').hide()
            $('.form-block1').hide()
            $('.form-block2').hide()
            $('.form-block3').hide()
            $('#btn-addition').hide()
            $('#btn-subtract').hide()

            //REGISTRATION
            $('#registration1').val(amount1)
            $('#regis1').html(amount1)
            $('#registration2').val(amount2)
            $('#regis2').html(amount2)

            //CONSULTATION
            $('#consultation1').val(payment1)
            $('#consult1').html(payment1)
            $('#consultation2').val(payment2)
            $('#consult2').html(payment2)
        }
    })

     //CLONING DEPENDANT FORM
     $('.add-more-btn').click(function() {
        // var clone = $('.form-block').clone('.form-clone');
        // $('.form-block').append(clone);
        $('.form-block2').show()
    });

    $('.add-btn').click(function() {
        // var clone = $('.form-block').clone('.form-clone');
        // $('.form-block').append(clone);
        $('.form-block3').show()
    });

    

})

function openPatientId() {
    $('#patientId').show()
    $('#dependants').show()
    $('.form-block1').show()
    $('#btn-addition').show()
    $('#btn-subtract').show()
}

function showOptions() {
    $('select #serology').show()
    // alert("id is " + s[s.selectedIndex].id); // get id
}

//getting the hmos
function gethmo() {
    const hmoid = $('#hmos').val()
    $('#hmoname').show()
    $.post('/get-hmo', { hmoid: hmoid })
    .done(function(data) {
        console.log(data)
        $.each(data, function(index, value){
            $("#mySelect").append($("<option>",{
                  value: value,
                  text: value
            }))
        })
    })
}

//getting user age
function getUserAge() {
    const userid = $('#patienttriage').val()
    $('#agecolumn').show()
    $.post('/get-patient-age', { userid: userid })
    .done(function(data) {
        console.log(data)
        $('#age').val(data)
        if(data < 1){
            $('#pulse').show()
            $('#hrate').hide()
        }else{
            $('#pulse').hide()
            $('#hrate').show()
        }
    })
}

//FUnction to calciulate BMI
function bmiCalc(){
    let weight = $('#weight').val()
    let height = $('#height').val()
    let bmi = weight/(height**2)
    $('#bmi').val(bmi)
}

//Getting the total amount of service
function serviceTotalAmount() {
    const theservice = $('#theservice').val()
    $.post('/get-total-amount', { theservice: theservice })
    .done(function(data) {
        console.log(data)
        $('#serviceprice').val(data)
    })
}

function getDrugInfo() {
    const drugId = $('#itemId').val()
    $.post('/get-drug-info', { drugId: drugId })
    .done(function(data) {
        console.log(data)
        $('#drugAmount').val(data.price)
        if(('rquantity' in data && data[1] === undefined)){
            $('#drugRemainder').val(data.rquantity)
        }else{
            $('#drugRemainder').val(data.quantity)
        }
    })
}

//Getting the drug prescriptions
