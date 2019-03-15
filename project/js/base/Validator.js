const VALIDATOR = {
  'NUMBER': /^[0-9]+$/,
  'PHONE': /^[\+ 0-9]+$/,
  'ALPHA': /^[a-zA-Z]+$/,
  'ALPHA_NUM': /^[a-zA-Z0-9]+$/,
  'STR_AND_NUM': /^([0-9]+[a-zA-Z]+|[a-zA-Z]+[0-9]+|[a-zA-Z]+[0-9]+[a-zA-Z]+)$/,
  'LOW_UP_NUM': /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*$/,
  'SLUG': /^[a-zA-Z0-9-_]+$/,
  'NAME': /^([a-zA-Z0-9 -]+)$/,
  'NAME_HUN': /^([a-zA-Z0-9ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû -]+)$/,
  'ADDRESS_HUN': /^([a-zA-Z0-9 ÁÉÍÓÖŐÚÜŰÔÕÛáéíóöőúüűôõû\,\.\-]+)$/,
  'STRING': 'ESCAPE_STRING',	// it is special
  'EMAIL': /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/,
  'IP': /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};