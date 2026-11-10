import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const require=createRequire(import.meta.url);
const {transformSync}=require('next/dist/build/swc');
const original=require.extensions['.js'];
const appRoot=resolve('app');
require.extensions['.css']=()=>{};
require.extensions['.js']=(module,filename)=>{
 if(filename.startsWith(appRoot+'\\')||filename.startsWith(appRoot+'/')){
  const {code}=transformSync(readFileSync(filename,'utf8'),{filename,jsc:{parser:{syntax:'ecmascript',jsx:true},transform:{react:{runtime:'automatic'}}},module:{type:'commonjs'}});
  module._compile(code,filename);
 }else original(module,filename);
};
const routes=['home-loan-calculator','emergency-fund','debt-trap-calculator','student-credit-cards','car-vs-uber','cashback-discount-calculator'];
test('all twelve calculator pages render real controls, methodology and valid related links',()=>{
 for(const language of ['en','hi'])for(const route of routes){
  const file=resolve('app',...(language==='hi'?['hi']:[]),route,'page.js');
  const Page=require(file).default;
  const html=renderToStaticMarkup(React.createElement(Page));
  assert.ok(html.includes('<h1')&&html.includes('<input'),'Missing controls: '+file);
  assert.ok(html.includes('toolpage-method'),'Missing methodology: '+file);
  assert.ok(html.includes('application/ld+json'),'Missing structured data: '+file);
  assert.ok(!html.includes('/guides/loans/'),'Broken loan-guide link');
  assert.ok(!html.includes('₹NaN')&&!html.includes('₹∞'),'Invalid currency result: '+file);
 }
});
test('invalid shopping price renders an error and does not invent an offer',()=>{
 const Calculator=require(resolve('app/SmartCardOfferCalculator.js')).default;
 const html=renderToStaticMarkup(React.createElement(Calculator,{initialPrice:''}));
 assert.ok(html.includes('role="alert"'));assert.ok(!html.includes('4.9'));
});

test('all ten permanent information pages render their contact and policy links',()=>{
 const InfoPage=require(resolve('app/info-page.js')).default;
 for(const language of ['en','hi'])for(const slug of ['about','privacy','contact','editorial-policy','terms']){
  const html=renderToStaticMarkup(React.createElement(InfoPage,{slug,language}));
  assert.ok(html.includes('<h1')&&html.includes('<article'),'Missing information page: '+slug);
  assert.ok(html.includes((language==='hi'?'/hi':'')+'/contact/'));
  if(slug==='contact')assert.ok(html.includes('https://github.com/pavanikumari555/sahifayda/issues/new'));
 }
});
