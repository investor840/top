let currentDate = new Date();
currentDate.setHours(currentDate.getHours() + 24);

localStorage.getItem('currentDate') ?? localStorage.setItem('currentDate', currentDate.getTime());
if (localStorage.getItem('currentDate') && localStorage.getItem('currentDate') < Date.now()) {
    localStorage.clear()
}

document.querySelectorAll('a').forEach((el) => {
    el.onclick = (e) => {
        e.preventDefault();
        document.querySelector('#forma').scrollIntoView({behavior: 'smooth', block: 'start'})
    }
})

let order = localStorage.getItem('order') ?? 0;
let parametr = new URLSearchParams(location.search);
localStorage.setItem('pixel', parametr.get('pixel') ?? 1);
localStorage.setItem('typepixel', parametr.get('typepixel') ?? 'Lead');

let country_code = '+52'

document.querySelectorAll('form').forEach((el) => {
    let btn = el.querySelector('button') ?? el.querySelector('input[type=submit]');
    let phone = el.phone;
    let name = el.first_name;
    if (!btn || !phone || !name) return

    btn.setAttribute('disabled', 'true');
    btn.style.opacity = '0.5';

    phone.oninput = function (e) {
        this.value = this.value.replace(/[^\d]/gi, '');
        if (!this.value.startsWith(country_code)) {
            this.value = country_code + this.value.slice(country_code.length - 1);
        }
        if (this.value.length == 13) {
            btn.style.opacity = '1'
            btn.removeAttribute('disabled')
        } else {
            btn.style.opacity = '0.5';
            btn.setAttribute('disabled', 'true')
        }


    }



    phone.onclick = function (e) {
        if (!this.value.startsWith(country_code)) {
            this.value = country_code + this.value
        }

    }

    el.onsubmit = async function (e) {
        e.preventDefault();
        if (phone.value == localStorage.getItem('phone')) {
            alert('You have already sent this number')
            return;
        }
        if (order == 2) {
            alert('You have already left 2 applications')
            return
        }
        btn.style.opacity = '0.5';
        btn.setAttribute('disabled', true);
        let result = await fetch('api.php', {
            method: 'POST',
            body: new FormData(this)
        });
        result = await result.json();
        console.log(result)
        if (result.message === "The lead saved") {
            order++
            localStorage.setItem('phone', phone.value);
            localStorage.setItem('order', order);
            try {
                let res =  fetch(`https://www.facebook.com/tr?id=${localStorage.getItem('pixel')}&ev=Lead&rqm=GET`);
            }catch {

            }
            if(result.redirect) {
                location.href = result.redirect
            }else {

                alert("Success");
            }



        } else {
            alert(result.message)
            btn.style.opacity = '1';
            btn.removeAttribute('disabled');
        }
    }
})


