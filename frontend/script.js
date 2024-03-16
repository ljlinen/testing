import { addEvents } from "./handleUI.js";
import { getData, postData } from "./requests.js";

const body_1 = document.querySelector('.body');
const body_2 = document.querySelector('.body-2');
const teamview = document.querySelector('.teamview');

export async function addTeamToView(teamindb, caller) {

    teamindb.forEach((data, i) => {

        const wrap_n = document.createElement('div');
        const wrap_e = document.createElement('div');
        const wrap_g = document.createElement('div');
        const wrap_i = document.createElement('div');
        const wrap_cont = document.createElement('div');
        const wrap = document.createElement('div');
        const input = document.createElement('input');
        const span = document.createElement('span');
        const label = document.createElement('label');
        const icon = document.createElement('img');

        wrap_n.classList.add('wrap-n');
        wrap_e.classList.add('wrap-e')
        wrap_g.classList.add('wrap-g')
        wrap_i.classList.add('wrap-i')
        wrap.classList.add('wrap-switch')
        input.setAttribute('type', 'checkbox')
        span.classList.add('slider', 'round')
        span.setAttribute('checked', data.sendmail)
        console.log('checked is initially ' + data.sendmail);
        span.setAttribute('id', data.idteam)
        label.classList.add('switch')
        icon.setAttribute('src', './style/remove.svg');
        icon.setAttribute('id', `${data.idteam}`);
        
        wrap_cont.classList.add('wrap-cont');

        const teammember = document.createElement('div')
        teammember.classList.add('teammember');
        

        if (caller != null || data.name === 'Admin') {
            icon.style.visibility = 'hidden';
            wrap.style.visibility = 'hidden';
            teammember.classList.add('not-saved');
        }
        let txtTeamName = document.createElement('p');
        txtTeamName.classList.add('txtTeamName');
        txtTeamName.innerText = data.name

        let txtTeamEmail = document.createElement('p');
        txtTeamEmail.classList.add('txtTeamEmail');
        txtTeamEmail.innerText = data.email

        let checked = span.getAttribute('checked')
        if (checked === 'true') {
            console.log('checked set to false from ' + checked);
            checked = true;
        } else {
            checked = false;
        }
        console.log('input was set to ' + checked);
        input.checked = checked;

        console.log(input.checked);

        wrap_n.append(txtTeamName);
        wrap_e.append(txtTeamEmail);
        label.append(input, span);
        wrap_i.append(icon);
        wrap.append(label);
        wrap_cont.append(wrap_n, wrap_e, wrap)
        teammember.append(wrap_cont, wrap_i);
        body_2.append(teammember)
    })

    if (caller == null) {
        console.log("adding events");
        addEvents();
    }
    
}

const loginBtn = document.querySelector('.input-btn');

loginBtn.addEventListener('click', () => {
    handleSignIn();
})

const handleSignIn = async() => {

    const email = document.querySelector('input[type="email"]');
    const password = document.querySelector('input[type="password"]');
    const txt1 = document.querySelector('.txt-1');
    const txt2 = document.querySelector('.txt-2');
    //const correctCRentials = await getData('admin');
    //console.log(correctCRentials);

if((email.value !== '' && email.value !== undefined)  && (password.value != '' && password.value !== undefined)) {

    const correctCRentials = await getData('admin');
    if (email.value.toLowerCase() === correctCRentials.email.toLowerCase() && password.value === correctCRentials.password) {
        
        const fromdb = await getData('team');
        console.log(fromdb)
        addTeamToView(fromdb);
        
        txt1.textContent = 'Manage Team';
        txt2.textContent = `disable mail to team members or add new members`;
        body_1.style.display = 'none'
        teamview.style.display = 'flex';

    } else {

        document.querySelector('.txt-3').innerHTML = "email or password invalid";
        document.querySelectorAll('input').forEach((input) => {

            if (input.getAttribute('type') !== 'button') {
                input.style.borderColor = 'red';
            }
            
        })
    }
  }
}

