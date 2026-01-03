//get date and return in 
export function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  export function formatDateAdvance(dateString, year = false, month = false, day = false) {
  //  console.log(dateString);
    var date = new Date(dateString);
    
    // Initialize options object
    var options = {};
  
    // Set options based on flags
    if (year) {
      options.year = 'numeric';
    }
    if (month) {
      options.month = 'long';
    }
    if (day) {
      options.day = 'numeric';
    }
  
    // If no options are provided, return only the year
    if (!year && !month && !day) {
      formattedDate = dateString;
    }else{
     // Format the date according to the options
     var formattedDate = date.toLocaleDateString('en-US', options);
    }
  
    
    return formattedDate;
  }
  
  