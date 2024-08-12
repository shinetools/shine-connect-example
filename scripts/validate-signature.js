"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var http_signature_1 = require("http-signature");
var sshpk_1 = require("sshpk");
var getRequiredQsealHeaders = function () { return [
    '(request-target)',
    'date',
    'psu-ip-address',
    'psu-ip-port',
    'psu-http-method',
    'psu-date',
    'psu-user-agent',
    'psu-referer',
    'psu-accept',
    'psu-accept-charset',
    'psu-accept-encoding',
    'psu-accept-language',
]; };
var CERTIFICATE_FORMAT = 'pem';
var validateSignature = function (body, certificate) { return __awaiter(void 0, void 0, void 0, function () {
    var parsedSignature, signatureKeyId, parsedCertificate, publicKey, result;
    return __generator(this, function (_a) {
        parsedSignature = (0, http_signature_1.parseRequest)(body, {
            authorizationHeaderName: 'signature',
            headers: getRequiredQsealHeaders(),
            strict: true,
        });
        signatureKeyId = parsedSignature.params.keyId;
        parsedCertificate = (0, sshpk_1.parseCertificate)(certificate, CERTIFICATE_FORMAT);
        publicKey = parsedCertificate.subjectKey;
        result = (0, http_signature_1.verifySignature)(parsedSignature, publicKey.toString(CERTIFICATE_FORMAT));
        console.log('Signature verified result for signatureKeyId:', signatureKeyId);
        console.log(result);
        return [2 /*return*/];
    });
}); };
var req = {
    method: 'GET',
    url: '/users/profiles/e719f43e-a9bb-4dd8-bf61-68c0b251250e',
    headers: {
        public_load_balancer: 'false',
        client_cert_present: 'true',
        client_cert_chain_verified: 'true',
        'psu-accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'psu-accept-charset': 'utf-8',
        'psu-accept-encoding': 'gzip, deflate, br',
        'psu-accept-language': 'en-US,en;q=0.9',
        'psu-date': '2019-01-01T00:00:00Z',
        'psu-http-method': 'GET',
        'psu-ip-address': '127.0.0.1',
        'psu-ip-port': 443,
        'psu-referer': 'https://localhost:443/',
        'psu-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        authorization: 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5zaGluZS5mciIsImF6cCI6IjZjOWU2ZjZmLTM0OGEtNGUyOC1hZTA5LWY1OWJhZDZkYzZiMyIsImNsYWltcyI6eyJjb21wYW55UHJvZmlsZUlkIjoiZGJkNmE0ZWUtOTlkNS00MzFiLWE3ZTctZWYwM2RiYWU1ODJhIiwiY29tcGFueVVzZXJJZCI6IjRiNDA2ZDUzLTRhZTEtNDkwOC05N2E0LTc1Y2EzZmUzZmU3NiJ9LCJleHAiOjE3MTMzMzc0ODQsImlhdCI6MTcxMzMzMzg4NCwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zaGluZS5mciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgdXNlcjpwcm9maWxlOnJlYWQiLCJzdWIiOiJlNzE5ZjQzZS1hOWJiLTRkZDgtYmY2MS02OGMwYjI1MTI1MGUifQ.sjL1HQOvJuFgkLxO0tbGMBjnPRStKftvkuqTeMg3SBeqNCsgMrR4S07KObZpeqyHMhIgLwQPK73mLLe8in_uHwo-Brkc8LVAgvcasIV4wDGkdgwjUEDwXHrU7tPqkxYoateTHLktHsWh_Cc1Q-R2qsbQHmGONNbwrKeY7B8tIREh-JW0iqqAYZwza5ouGnVzi3TrPc-AHT4mOwl54c5LZqBMHXMFYtjMiSveJ2BwOVi4IBm4tXWpQas8UVIKzU2MXUPg6om5_PW_pOW0zp9st3bgRlw5QshdllC1EDEzMIhvZDmAPz9mjbKmT-j5SiqBlXsl_KhWMbKTxuOwGQqTxQ',
        host: 'localhost:10081',
        date: 'Wed, 17 Apr 2024 07:04:20 GMT',
        signature: 'keyId="PSDFR-ACPR-71758",algorithm="rsa-sha256",headers="(request-target) date psu-ip-address psu-ip-port psu-http-method psu-date psu-user-agent psu-referer psu-accept psu-accept-charset psu-accept-encoding psu-accept-language",signature="Z+zWXASDGNZ6bxdJ7vbH+sa9fewp4LVQ0VWcufhyo84tLau+9sklQYviAYp3s6ZeK0o/LwYBrlFIe4A7Auz3lJ42c7TqcP+tZpJqniVhKL0V9LjAdm/VpKgINF7qzStcvAE7P0Vph2hO9YnXTsTjKUtHu2mBUpCNVKXgNVRw4CMsLOnObijTFfKGb6RLsMb6g6ORVyOwZmsSsTgw+pboPI2+j8XCdVvmP1/It+dEvnog7Po4Am/Akqryo0Gc0gikveyRsyGiwK0nmkOiO7doDhVQ9MaQqIfCqvosXEQRstune+N4WbLzO3H1g9XIricdgDhgSeB93eKXhJ5+ZkdziQ=="',
    },
};
var certStr = (0, fs_1.readFileSync)('./qseal.pem', 'utf-8');
validateSignature(req, certStr);
