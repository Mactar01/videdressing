import './polyfills.server.mjs';
import{m as r,q as i,rb as a}from"./chunk-OODRITHP.mjs";var o=class t{http=i(a);apiUrl="/api/v1/categories";getCategories(){return this.http.get(this.apiUrl)}getAttributes(e){return this.http.get(`${this.apiUrl}/${e}/attributes`)}static \u0275fac=function(n){return new(n||t)};static \u0275prov=r({token:t,factory:t.\u0275fac,providedIn:"root"})};export{o as a};
