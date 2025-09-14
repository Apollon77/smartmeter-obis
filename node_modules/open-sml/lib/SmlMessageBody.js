/*!
 * OpenSML
 * Copyright(c) 2014-2015 D. Spautz (d.spautz@web.de)
 * MIT Licensed
 */

var Constants = require('./Constants');

var SmlAttentionResponse = require('./messages/SmlAttentionResponse');
var SmlPublicCloseRequest = require('./messages/SmlPublicCloseRequest');
var SmlPublicCloseResponse = require('./messages/SmlPublicCloseResponse');
var SmlGetListRequest = require('./messages/SmlGetListRequest');
var SmlGetListResponse = require('./messages/SmlGetListResponse');
var SmlGetProcParameterRequest = require('./messages/SmlGetProcParameterRequest');
var SmlGetProcParameterResponse = require('./messages/SmlGetProcParameterResponse');
var SmlGetProfileListRequest = require('./messages/SmlGetProfileListRequest');
var SmlGetProfileListResponse = require('./messages/SmlGetProfileListResponse');
var SmlGetProfilePackRequest = require('./messages/SmlGetProfilePackRequest');
var SmlGetProfilePackResponse = require('./messages/SmlGetProfilePackResponse');
var SmlPublicOpenRequest = require('./messages/SmlPublicOpenRequest');
var SmlPublicOpenResponse = require('./messages/SmlPublicOpenResponse');
var SmlSetProcParameterRequest = require('./messages/SmlSetProcParameterRequest');
var SmlSetProcParameterResponse = require('./messages/SmlSetProcParameterResponse');

function SmlMessageBody(messageTag){

	switch(messageTag) {
		case Constants.PUBLIC_OPEN_REQUEST:
			return new SmlPublicOpenRequest();

		case Constants.PUBLIC_OPEN_RESPONSE:
			return new SmlPublicOpenResponse();

		case Constants.PUBLIC_CLOSE_REQUEST:
			return new SmlPublicCloseRequest();

		case Constants.PUBLIC_CLOSE_RESPONSE:
			return new SmlPublicCloseResponse();

		case Constants.GET_PROFILE_PACK_REQUEST:
			return new SmlGetProfilePackRequest();

		case Constants.GET_PROFILE_PACK_RESPONSE:
			return new SmlGetProfilePackResponse();

		case Constants.GET_PROFILE_LIST_REQUEST:
			return new SmlGetProfileListRequest();

		case Constants.GET_PROFILE_LIST_RESPONSE:
			return new SmlGetProfileListResponse();

		case Constants.GET_PROC_PARAMETER_REQUEST:
			return new SmlGetProcParameterRequest();

		case Constants.GET_PROC_PARAMETER_RESPONSE:
			return new SmlGetProcParameterResponse();

		case Constants.SET_PROC_PARAMETER_REQUEST:
			return new SmlSetProcParameterRequest();

		case Constants.SET_PROC_PARAMETER_RESPONSE:
			return new SmlSetProcParameterResponse();

		case Constants.GET_LIST_REQUEST:
			return new SmlGetListRequest();

		case Constants.GET_LIST_RESPONSE:
			return new SmlGetListResponse();

		case Constants.ATTENTION_RESPONSE:
			return new SmlAttentionResponse();

		default:
	        return undefined;
	}
}

SmlMessageBody.parse = function parse(smlBuffer, messageTag) {

	switch(messageTag) {
	case Constants.PUBLIC_OPEN_REQUEST:
		return SmlPublicOpenRequest.parse(smlBuffer);

	case Constants.PUBLIC_OPEN_RESPONSE:
		return SmlPublicOpenResponse.parse(smlBuffer);

	case Constants.PUBLIC_CLOSE_REQUEST:
		return SmlPublicCloseRequest.parse(smlBuffer);

	case Constants.PUBLIC_CLOSE_RESPONSE:
		return SmlPublicCloseResponse.parse(smlBuffer);

	case Constants.GET_PROFILE_PACK_REQUEST:
		return SmlGetProfilePackRequest.parse(smlBuffer);

	case Constants.GET_PROFILE_PACK_RESPONSE:
		return SmlGetProfilePackResponse.parse(smlBuffer);

	case Constants.GET_PROFILE_LIST_REQUEST:
		return SmlGetProfileListRequest.parse(smlBuffer);

	case Constants.GET_PROFILE_LIST_RESPONSE:
		return SmlGetProfileListResponse.parse(smlBuffer);

	case Constants.GET_PROC_PARAMETER_REQUEST:
		return SmlGetProcParameterRequest.parse(smlBuffer);

	case Constants.GET_PROC_PARAMETER_RESPONSE:
		return SmlGetProcParameterResponse.parse(smlBuffer);

	case Constants.SET_PROC_PARAMETER_REQUEST:
		return SmlSetProcParameterRequest.parse(smlBuffer);

	case Constants.SET_PROC_PARAMETER_RESPONSE:
		return SmlSetProcParameterResponse.parse(smlBuffer);

	case Constants.GET_LIST_REQUEST:
		return SmlGetListRequest.parse(smlBuffer);

	case Constants.GET_LIST_RESPONSE:
		return SmlGetListResponse.parse(smlBuffer);

	case Constants.ATTENTION_RESPONSE:
		return SmlAttentionResponse.parse(smlBuffer);

	 default:
        return undefined;
	}
};

module.exports = SmlMessageBody;
