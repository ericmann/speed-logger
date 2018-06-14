module.exports = function formatBytes(bytes,decimals,hide) {
   if(bytes == 0) return '0 Bytes';
   var k = 1000,
       dm = decimals || 2,
       sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
       i = Math.floor(Math.log(bytes) / Math.log(k));
	   if(decimals === 0) dm = 0;
   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + (hide?'':(sizes[i] + '/s'));
}