import swal from 'sweetalert';
import axios from 'axios';

const SwallRequest = (url, data=new FormData(), params=new Object()) => {
    data.append('_token', document.querySelector('meta[name=csrf-token]').content)
    swal({
        title: "Are you sure ?",
        icon: "warning",
        buttons: [
            "Cancel", 
            {
                text: data.get('_method') == 'DELETE' ? 'Delete !' : 'Save',
                closeModal: false,
            }
        ],
        dangerMode: data.get('_method') == 'DELETE' ? true : false,
        closeOnClickOutside: false,
        closeOnEsc: false,
    })
    .then(confirm => {
        console.log('confirm',confirm)
        if (!confirm) throw null;

        return axios.post(url, data)
        .then(response => {
            console.log('axios response',response)
            return response
        })
        .catch(error => {
            console.log('axios error',error.response)
            return error.response
        })
    })
    .then(response => {
        console.log('response',response)
        swal.stopLoading()
        if(response.statusText == 'OK') {
            return swal('Good job !', `${response.data.message}`, 'success')
            .then(() => {
                if(params.hasOwnProperty('redirect')) {
                    params.redirect(true)
                }
                if(params.hasOwnProperty('reload')) {
                    params.reload(params.params)
                }
            })
        }
        return swal('Error !', `${response.data.message}`, 'error')
        .then(() => {
            if(params.hasOwnProperty('errors')) {
                params.errors(response.data.errors)
            }
        })
    })
}

export { SwallRequest }