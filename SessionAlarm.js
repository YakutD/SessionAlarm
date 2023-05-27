console.warn('SessionAlarm IS READY TO USE');

class SessionAlarm {
    _xhttp = null;
    _modal = null;
    _ajaxInterval = null;
    _stIds = [];
  
    init(seconds, options = {}) {
        
        this._reset();

        if(!this._checkTypeOfSeconds(seconds))
            throw `The 'seconds' argument must be a number, a ${seconds} is passed.`;

        seconds = this._normalizeFloat(seconds);

        if(options?.ajax) {
            if(typeof options.ajax.url != 'string')
                throw `The 'ajax.url' option must be a string, a ${typeof options.ajax.url} is passed.`;
            else if(options.ajax?.method && typeof options.ajax?.method != 'string')
                throw `The 'ajax.method' option must be a string, a ${typeof options.ajax.method} is passed.`;

            console.warn(`AJAX ALARM REQUEST WILL HAPPEN EVERY ${seconds}`);
            this._xhttp = new XMLHttpRequest;
            let ajaxAlarm = () => {
                this._ajaxInterval = setInterval(() => {
                    this._xhttp.open(options.ajax?.method ?? 'GET', options.ajax.url, true);
                    this._xhttp.send();
                }, this._toMilliseconds(seconds));
            }
            this.cancel = () => {
                this._resetAjax();
                console.warn("AJAX ALARM REQUEST WAS MANUALLY CANCELLED");
            }
            this.restart = () => {
                this._resetAjax();

                console.warn("AJAX ALARM REQUEST HAS BEEN MANUALLY RESTARTED");

                ajaxAlarm();
            };

            ajaxAlarm();
        }
        else {

            let remindMsg = null;
            if(options?.remind)
            {
                if(!this._checkTypeOfSeconds(options.remind))
                    throw `The 'remind' option must be a number, a ${typeof options.remind} is passed.`;
                
                options.remind = this._normalizeFloat(options?.remind);
                if(options.remind >= seconds)
                    throw `The 'remind' option must be less than 'seconds' (${seconds}) argument, ${options.remind} is passed.`;
            
                
                let dist = this._normalizeFloat(seconds - options.remind);
                remindMsg = `Reload will happen in ${dist}`;
            }
        
            let startReload = () => {
                console.warn(`THE PAGE WILL BE RELOADED IN ${seconds} SECONDS`);

                if(options?.confirm)
                {
                    this._stIds.push(setTimeout(() => {
                        this._showConfirmation();
                    }, this._toMilliseconds(seconds)));
                }
                else {
                    this._stIds.push(setTimeout(() => {
                        this._reload();
                    }, this._toMilliseconds(seconds)));
                }

                if(remindMsg){
                    this._stIds.push(setTimeout(() => {
                        console.log(remindMsg);
                    }, this._toMilliseconds(options.remind)));
                }
            }
            this.cancel = () => {
                this._resetReload();
                console.warn("PAGE RELOAD WAS MANUALLY CANCELLED");
            }
            this.restart = () => {
                this._resetReload();

                console.warn("PAGE RELOAD HAS BEEN MANUALLY RESTARTED");

                startReload();
            };

            startReload();
        }
    }
    _reload(){
        location.reload();
    }
    _reset() {
        this._resetReload();
        this._resetAjax();        
    }
    _resetReload(){
        this._modal?.remove();
        this._stIds.forEach(stId => clearTimeout(stId));
    }
    _resetAjax(){
        clearInterval(this._ajaxInterval);
    }
    _checkTypeOfSeconds(x){
        return (typeof x === 'number' && !Number.isNaN(x));
    }
    _toMilliseconds(x){
        return Math.round(x * 1000);
    }
    _normalizeFloat(x){
        return parseFloat(x.toFixed(2))
    }
    _showConfirmation(){
        let modal = document.createElement('dialog');
        modal.setAttribute('open', true);
        modal.setSty

        let message = document.createElement('p');
        message.textContent = 'Confirm reload page by SessionAlarm:';
        modal.appendChild(message);

        Object.entries({
            Confirm: () => this._reload(),
            Restart: () => this.restart(),
            Cancel:  () => this.cancel(),
        }).forEach(([text, callback]) => {
            let btn = document.createElement('button');
        
            btn.textContent = text;
            btn.addEventListener('click', callback);
            btn.style.margin = '10px';

            modal.appendChild(btn);
        });

        this._modal = modal;
        document.body.appendChild(modal);
    }
}