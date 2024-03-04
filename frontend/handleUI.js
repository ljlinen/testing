import { getData, postData, putData } from "./requests.js";
import { ReqData } from "./Global.js";
import { makeObject } from "./Global.js";
import { logReqData } from "./Global.js";
import { addTeamToView } from "./script.js";
    
    const txtHeading = document.querySelector('.txt-2');
    const savebtn = document.querySelector('#save');
    const cancel = document.querySelector('#cancel');
    const nameInput = document.querySelector('#add-member-name');
    const emailInput = document.querySelector('#add-member-email');
    const addMemberBtn = document.querySelector('.wrap-add-btn');
    
cancel.addEventListener('click', () => {
        
    for (let value of ReqData.update.values()) {
            let wasSetTo = JSON.parse(value.sendmail); 
            let elemSlider = document.querySelector(`.slider[id='${value.idteam}']`);
            let elemInput = elemSlider.previousElementSibling;
            elemInput.checked = !wasSetTo;
        }

        for (let value of ReqData.delete.values()) {
            let elem = document.querySelector(`img[id='${value}']`);
            elem.style.visibility = 'unset';
        }

        ReqData.add.clear();
        ReqData.delete.clear();
        ReqData.update.clear();
        
        const notSavedMembers = document.querySelectorAll('.teammember.not-saved');
        for (let i = 0; i < notSavedMembers.length; i++) {
            
            notSavedMembers[i].remove();
    }
    
    savebtn.style.opacity = 0.6;
    cancel.style.display = 'none';

})

addMemberBtn.addEventListener('click', () => {
    
        const name = nameInput.value;
        const email = emailInput.value;
        
        if((email.length < 1 || name.length < 1)) {
            txtHeading.textContent = "please enter correct details";
            return true;
        } else {
            txtHeading.textContent = "don't forget to save after adding members";
        }

        cancel.style.display = 'flex';
        const member = makeObject(0, name, email, 'true', '');
        
        let found = true;
        
        while (found) {
            let id = 'notsaved';
            for (let i = 0; found; i++) {
                if (ReqData.add.has(id)) {
                    id = id + `i`;
                } else {
                    found = false;
                    ReqData.add.set(id, member);
                    addTeamToView([member], 'add');
                    savebtn.style.opacity = '100%';
                }
            }
    }
    nameInput.value = '';
    emailInput.value = '';
})

export async function addEvents() {
    
    const sliders = document.querySelectorAll('.slider');
    const deleteBtn = document.querySelectorAll('.wrap-i');

    for (let i = 0; i < sliders.length; i++) {
        sliders[i].addEventListener('click', () => {
            const checked = sliders[i].getAttribute('checked');
            const id = sliders[i].getAttribute('id');

            console.log('id for clicked slider is ' + id);
    
            let newValue = null;
            if (checked === 'true') {
                console.log(id + ' checked');
                newValue = 'false';
            } else {
                console.log(id + ' unchecked');
                newValue = 'true';
            }


            if (ReqData.update.has(id)) {
                ReqData.update.delete(id);
                if (ReqData.update.size < 1) {
                    cancel.style.display = 'none';
                    savebtn.style.opacity = 0.7;
                }
            } else {
                ReqData.update.set(id, makeObject(id, '', '', newValue, ''))
                cancel.style.display = 'flex'
                savebtn.style.opacity = '100%';
                
            }

            
            logReqData('addEvents');
        });
    }

    for (let i = 0; i < deleteBtn.length; i++) {
        deleteBtn[i].addEventListener('click', () => {
            
            const id = sliders[i].getAttribute('id');
            let deleting = document.querySelector(`img[id="${id}"]`);

            if (id == 1) {
                txtHeading.textContent = 'note: you cannot remove an admin';
            }

            if (ReqData.delete.has(id)) {
                ReqData.delete.delete(id);
                if (ReqData.delete.size < 1) {
                    cancel.style.display = 'none';
                    savebtn.style.opacity = 0.7;
                    deleting.style.visibility = 'visible';
                }
            } else {
                ReqData.delete.set(id, id);
                cancel.style.display = 'flex'
                savebtn.style.opacity = '100%';
                deleting.style.visibility = 'hidden';
            }
            
            console.log(ReqData);
        });
    }
    
}

savebtn.addEventListener('click', async () => {

    let length = 0;

    for (let key in ReqData) {
        length += ReqData[key].size;
        console.log(length);
    }
    if (length < 1) {
        txtHeading.textContent = 'note: make changes before saving'
        return
    }

        
        try {
            const res = await putData('team', ReqData);
            

            if (res.status === 200) {
                
                    Toastify({
                    text: await res.json(),
                    duration: 8000,
                    destination: "https://github.com/apvarun/toastify-js",
                    close: false,
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    onClick: function(){close()} // Callback after click
                    }).showToast();
                
                for (let value of ReqData.delete.values()) {
                    let view = document.querySelector(`.slider[id='${value}']`);

                    for (let i = 0; i < 4; i++) {
                        view = view.parentNode;
                        console.log(view);
                        
                    }
                    view.remove()
                }

                for (let value of ReqData.add.values()) {
                    let view = document.querySelector(`.slider[id='${value.idteam}']`);
                    view.setAttribute('id',value.idteam)
                    view.style.visibility = 'visible';
                    txtHeading.textContent = 'changing settings of new mambers will be available after refreshing';
                    view.parentNode.parentNode.parentNode.parentNode.classList.remove('not-saved')
                    // view.parentNode.parentNode.parentNode.nextSibling.firstChild.style.visibility = 'visible';
                
                }
            }
            
            ReqData.add.clear();
            ReqData.delete.clear();
            ReqData.update.clear();


        } catch (err) {
            console.log(err);
            throw new Error('erorr putting data ' + err);
        }

    })