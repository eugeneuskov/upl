(function ($) {

  let reader = {}
  let file = {}
  const slice_size = 1000 * 1024

  $('#upload-action').click(function (e) {
    e.preventDefault()

    file = document.querySelector('#file').files[0]
    if (file) {
      const start_upload = checkLocalStorage()
      reader = new FileReader()
      uploadFile(start_upload)
    }
  })

  function uploadFile(start) {
    let next_slice = start + slice_size + 1;
    const blob = file.slice(start, next_slice)

    reader.onloadend = function(event) {
      if (event.target.readyState !== FileReader.DONE) {
        return;
      }

      $.ajax({
        url: '/upload.php',
        type: 'POST',
        dataType: 'json',
        cache: false,
        data: {
          action: 'upload',
          file_data: event.target.result,
          file: file.name,
          file_type: file.type,
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR, textStatus, errorThrown)
        },
        success: function(data) {
          const size_done = start + slice_size;
          const percent_done = Math.floor((size_done / file.size) * 100)

          if (next_slice < file.size) {
            $('p.progress').html('Uploading File - ' + percent_done + '%')
            updateLocalStorageValue('uploadfilestart', next_slice)
            uploadFile(next_slice)
          } else {
            $('p.progress').html('Upload Complete!')
            clearLocalStorage()
          }
        }
      });
    }

    reader.readAsDataURL(blob);
  }



  function checkLocalStorage() {
    if (
        getLocalStorageValue('uploadfilename', file.name) &&
        getLocalStorageValue('uploadfilesize', file.size) &&
        getLocalStorageValue('uploadfiletype', file.type)
    ) {
      return parseInt(localStorage.getItem('uploadfilestart'));
    }

    return 0;
  }

  function getLocalStorageValue(param, file_param) {
    if (localStorage.getItem(param)) {
      if (localStorage.getItem(param) == file_param) {
        return true
      }
    }

    setLocalStorageValues()
    return false
  }

  function setLocalStorageValues() {
    localStorage.setItem('uploadfilename', file.name)
    localStorage.setItem('uploadfilesize', file.size)
    localStorage.setItem('uploadfiletype', file.type)
    localStorage.setItem('uploadfilestart', '0')
  }

  function updateLocalStorageValue(param, value) {
    console.log(param, value)
    localStorage.setItem(param, value)
  }

  function clearLocalStorage() {
    localStorage.removeItem('uploadfilename')
    localStorage.removeItem('uploadfilesize')
    localStorage.removeItem('uploadfiletype')
    localStorage.removeItem('uploadfilestart')
  }

})(jQuery)