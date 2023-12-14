import{useState as e,useEffect as t}from"react";import{BehaviorSubject as s,distinctUntilKeyChanged as a,pluck as r,map as n,distinctUntilChanged as i}from"rxjs";import u from"lodash/isEqual";function o(e){var t;return{isSubmitting:!1,hasSubmitted:!1,attemptedSubmit:!1,hasDefaultValues:!1,hasDefaultCurrentStep:!1,handlers:{change:()=>{},blur:()=>{},submit:async()=>{},validate:async()=>({})},snapshot:null,history:[],debug:null!==(t=null==e?void 0:e.debug)&&void 0!==t&&t}}function l(e){return{values:{},fields:{},steps:{total:1,current:1,canNext:!1,canPrevious:!1},form:o(e)}}function c(e,t){var s;switch(e.form.debug&&e.form.history.push(t),t.type){case"INIT":{const e=l(null==t?void 0:t.payload);return(null===(s=t.payload)||void 0===s?void 0:s.debug)&&e.form.history.push(t),e}case"REGISTER_FIELD":return{...e,values:{...e.values,[t.payload]:null},fields:{...e.fields,[t.payload]:{meta:{pristine:!0,hasError:!1,isTouched:!1}}}};case"SET_DEFAULT_VALUES":return function(e,t){if(t){const s={...e.values};return{...e,values:Object.assign(s,t),form:{...e.form,hasDefaultValues:!0}}}return e}(e,t.payload);case"SET_HANDLERS":{const s=Object.assign({...e.form.handlers},t.payload);return{...e,form:{...e.form,handlers:s}}}case"FIELD_CHANGE":{const{values:s}=e,{name:a,value:r}=t.payload,n={...s},i=Object.assign(n,{[a]:r});return{...e,values:i}}case"SET_FIELD_PRISTINE":{const{name:s,pristine:a}=t.payload,{fields:r}=e;if(r[s].meta.pristine){const t={...r};return t[s].meta.pristine=a,{...e,fields:t}}return e}case"FIELD_BLUR":{const{values:s}=e,{name:a,value:r}=t.payload,n={...s},i=Object.assign(n,{[a]:r});return{...e,values:i}}case"SET_FIELD_TOUCHED":{const{name:s,isTouched:a}=t.payload,{fields:r}=e;if(!r[s].meta.isTouched){const t={...r};return t[s].meta.isTouched=a,{...e,fields:t}}return e}case"SET_VALIDATION_ERRORS":{const s=t.payload,a=Object.entries(e.fields).reduce(((e,[t,a])=>t in s?{...e,[t]:{...a,meta:{...a.meta,hasError:!0},error:s[t]}}:{...e,[t]:{meta:{...a.meta,hasError:!1}}}),e.fields);return{...e,fields:a}}case"IS_SUBMITTING":return{...e,form:{...e.form,isSubmitting:!0}};case"HAS_SUBMITTED":return{...e,form:{...e.form,isSubmitting:!1,hasSubmitted:!0}};case"ATTEMPTED_SUBMIT":return{...e,form:{...e.form,attemptedSubmit:!0}};case"SET_TOTAL_STEPS":{const s=t.payload,a=s>1;return{...e,steps:{...e.steps,total:s,canNext:a}}}case"SET_DEFAULT_CURRENT_STEP":{const s=t.payload,a=s<e.steps.total,r=s>1;return{...e,steps:{...e.steps,current:s,canNext:a,canPrevious:r},form:{...e.form,hasDefaultCurrentStep:!0}}}case"SET_CURRENT_STEP":{const s=t.payload,a=s<e.steps.total,r=s>1;return{...e,steps:{...e.steps,current:s,canNext:a,canPrevious:r}}}case"STEP_TO_NEXT":{const t=e.steps.total,s=e.steps.canNext,a=e.steps.current,r=s?a+1:a,n=r<t,i=r>1;return{...e,steps:{...e.steps,current:r,canNext:n,canPrevious:i}}}case"STEP_TO_PREVIOUS":{const t=e.steps.total,s=e.steps.canPrevious,a=e.steps.current,r=s?a-1:a,n=r<t,i=r>1;return{...e,steps:{...e.steps,current:r,canNext:n,canPrevious:i}}}case"STEP_TO_FIRST":{const t=1,s=!1,a=e.steps.total>t;return{...e,steps:{...e.steps,current:t,canNext:a,canPrevious:s}}}case"STEP_TO_LAST":{const t=e.steps.total,s=!1,a=t>1;return{...e,steps:{...e.steps,current:t,canNext:s,canPrevious:a}}}case"SNAPSHOT_STATE":return{...e,form:{...e.form,snapshot:{values:{...e.values},fields:{...e.fields},steps:{...e.steps},form:{...e.form}}}};case"RESET":{if(!e.form.snapshot)return e;const{values:t,fields:s,form:a,steps:r}=e.form.snapshot;return{...e,values:{...t},fields:{...s},steps:{...r},form:{...e.form,...a}}}default:return e}}class d{constructor(){this.dispatch=(e,t)=>{var s,a,r,n;this._checkPrerequisites(e);const i=null===(s=this._states[e])||void 0===s?void 0:s.getValue(),u=null===(r=(a=this._reducers)[e])||void 0===r?void 0:r.call(a,i,t);null===(n=this._states[e])||void 0===n||n.next(u)},this.asyncDispatch=async(e,t,s)=>{this._checkPrerequisites(e);const a=await s(this._states[e].getValue());this.dispatch(e,{type:t,payload:a})},this._reducers={},this._states={}}init(e){this._reducers[e]||(Object.assign(this._reducers,{[e]:c}),this._states[e]||Object.assign(this._states,{[e]:new s(l())}))}setReducer(e,t){this._checkPrerequisites(e),this._reducers[e]=t(c)}select(e,t){return this._checkPrerequisites(e),this._states[e].pipe(a(t),r(t))}selectValue(e,t){return this._checkPrerequisites(e),this._states[e].pipe(n((e=>{var s;return null===(s=null==e?void 0:e.values)||void 0===s?void 0:s[t]})),i(u))}selectField(e,t){return this._checkPrerequisites(e),this._states[e].pipe(n((e=>{var s,a;return{value:null===(s=null==e?void 0:e.values)||void 0===s?void 0:s[t],meta:null===(a=null==e?void 0:e.fields)||void 0===a?void 0:a[t]}})),i(u))}subscribe(e,t){var s;return this._checkPrerequisites(e),null===(s=this._states[e])||void 0===s?void 0:s.subscribe(t)}_checkPrerequisites(e){if(!this._states[e])throw new Error(`Store does not contain "state" with key "${e}".\n\n        Did you forgot to call Store.init("${e}")?\n`);if(!this._reducers[e])throw new Error(`Store does not contain "reducer" with key "${e}".\n\n          Did you forgot to call Store.init("${e}")?\n`)}}function p(e){const{values:t,...s}=e;return s}function v(e,t,s){return Object.assign(s,{[e]:t})}function h(e,t){function s(s){t.dispatch(e,{type:"SET_VALIDATION_ERRORS",payload:s})}function a(a){t.subscribe(e,(async e=>{var t,r,n,i;const{values:u,form:o}=e;try{if(null==a?void 0:a.attemptedSubmit){if(o.attemptedSubmit){const a=await(null===(r=(t=o.handlers).validate)||void 0===r?void 0:r.call(t,u,p(e)));a&&s(a)}}else{const t=await(null===(i=(n=o.handlers).validate)||void 0===i?void 0:i.call(n,u,p(e)));t&&s(t)}}catch(e){}})).unsubscribe()}function r(s,a){t.subscribe(e,(e=>{var t,r;const{values:n,form:i}=e,u=v(s,a,n);null===(r=(t=i.handlers).change)||void 0===r||r.call(t,u,p(e))})).unsubscribe()}return{registerField:function(s){t.dispatch(e,{type:"REGISTER_FIELD",payload:s})},setDefaultValues:function(s){t.dispatch(e,{type:"SET_DEFAULT_VALUES",payload:s})},setHandlers:function(s){t.dispatch(e,{type:"SET_HANDLERS",payload:s})},setValidationErrors:s,setTotalSteps:function(s){t.dispatch(e,{type:"SET_TOTAL_STEPS",payload:s})},setDefaultCurrentStep:function(s){t.dispatch(e,{type:"SET_DEFAULT_CURRENT_STEP",payload:s})},setCurrentStep:function(s){t.dispatch(e,{type:"SET_CURRENT_STEP",payload:s})},stepToNext:function(){t.dispatch(e,{type:"STEP_TO_NEXT"})},stepToPrevious:function(){t.dispatch(e,{type:"STEP_TO_PREVIOUS"})},stepToFirst:function(){t.dispatch(e,{type:"STEP_TO_FIRST"})},stepToLast:function(){t.dispatch(e,{type:"STEP_TO_LAST"})},validate:a,handleChangeCallback:r,handleFieldChange:function(s){return function(n){var i;let u=n;(null==n?void 0:n.nativeEvent)&&(u=null===(i=null==n?void 0:n.target)||void 0===i?void 0:i.value),a({attemptedSubmit:!0}),r(s,u),t.dispatch(e,{type:"FIELD_CHANGE",payload:{name:s,value:u}}),t.dispatch(e,{type:"SET_FIELD_PRISTINE",payload:{name:s,pristine:!1}})}},handleFieldBlur:function(s){return function(r){var n;let i=r;(null==r?void 0:r.nativeEvent)&&(i=null===(n=null==r?void 0:r.target)||void 0===n?void 0:n.value),a({attemptedSubmit:!0}),t.subscribe(e,(e=>{var t;const a=e.values,r=null===(t=e.form.handlers)||void 0===t?void 0:t.blur,n=v(s,i,a);null==r||r(n,p(e))})).unsubscribe(),t.dispatch(e,{type:"FIELD_BLUR",payload:{name:s,value:i}}),t.dispatch(e,{type:"SET_FIELD_TOUCHED",payload:{name:s,isTouched:!0}})}},handleSubmit:function(a){var r;null===(r=null==a?void 0:a.preventDefault)||void 0===r||r.call(a),t.dispatch(e,{type:"ATTEMPTED_SUBMIT"}),t.subscribe(e,(async a=>{var r,n;const i=a.values,u=null===(r=a.form.handlers)||void 0===r?void 0:r.submit,o=null===(n=a.form.handlers)||void 0===n?void 0:n.validate,l=p(a);try{const a=await(null==o?void 0:o(i,l));a&&Object.keys(a).length>0?s(a):(t.dispatch(e,{type:"IS_SUBMITTING"}),await(null==u?void 0:u(i,l)),t.dispatch(e,{type:"HAS_SUBMITTED"}))}catch(e){}})).unsubscribe()},asyncDispatch:function(s,a,r){var n;t.asyncDispatch(null!==(n=null==r?void 0:r.formId)&&void 0!==n?n:e,s,a)},snapshotState:function(){t.dispatch(e,{type:"SNAPSHOT_STATE"})},reset:function(){t.dispatch(e,{type:"RESET"})}}}new d;const f=new d;let T={};function S(s,a){const[r,n]=e((()=>l()));return t((()=>{f.init(s),f.dispatch(s,{type:"INIT",payload:a});const e=f.subscribe(s,n);return()=>e.unsubscribe()}),[]),r}function E(s,a,r){var n;const[i,u]=e({value:null===(n=T[a])||void 0===n?void 0:n[s],meta:{meta:{pristine:!0,hasError:!1,isTouched:!1}}}),{handleFieldBlur:o,handleFieldChange:l}=h(a,f);return t((()=>{f.init(a)}),[]),t((()=>{const e=f.selectField(a,s).subscribe(u);return()=>e.unsubscribe()}),[s]),{state:i,renderError:e=>{var t,s,a;return(null===(t=null==i?void 0:i.meta)||void 0===t?void 0:t.error)?e(null!==(a=null===(s=null==i?void 0:i.meta)||void 0===s?void 0:s.error)&&void 0!==a?a:""):null},getInputProps:()=>({name:s,id:s,value:i.value,onBlur:o(s),onChange:l(s)}),getLabelProps:()=>({htmlFor:String(s)}),getNativeInputProps:()=>({name:s,id:s,value:i.value,onBlur:o(s),onChangeText:l(s)})}}function m(e){var s;const a=S(e.formId,{debug:null!==(s=null==e?void 0:e.debug)&&void 0!==s&&s});e.defaultValues&&!T[e.formId]&&(T[e.formId]=e.defaultValues);const{reset:r,stepToLast:n,stepToNext:i,stepToFirst:u,setHandlers:o,handleSubmit:l,registerField:c,setTotalSteps:d,snapshotState:p,asyncDispatch:v,stepToPrevious:E,setCurrentStep:m,setDefaultValues:_,setValidationErrors:y,setDefaultCurrentStep:b}=h(e.formId,f);return t((()=>{e.defaultValues&&(Object.keys(e.defaultValues).forEach(c),_(null==e?void 0:e.defaultValues)),e.defaultCurrentStep&&b(null==e?void 0:e.defaultCurrentStep),(null==e?void 0:e.totalSteps)&&d(e.totalSteps),(null==e?void 0:e.stateReducer)&&f.setReducer(e.formId,(t=>(s,a)=>{var r;return null===(r=e.stateReducer)||void 0===r?void 0:r.call(e,s,a,t(s,a))})),o({blur:null==e?void 0:e.onBlur,change:null==e?void 0:e.onChange,submit:null==e?void 0:e.onSubmit,validate:null==e?void 0:e.validator}),p()}),[]),t((()=>{(null==e?void 0:e.stateReducer)&&f.setReducer(e.formId,(t=>(s,a)=>{var r;return null===(r=e.stateReducer)||void 0===r?void 0:r.call(e,s,a,t(s,a))}))}),[null==e?void 0:e.stateReducer]),{state:a,reset:r,stepToNext:i,stepToLast:n,stepToFirst:u,handleSubmit:l,asyncDispatch:v,setCurrentStep:m,stepToPrevious:E,setDefaultValues:_,setValidationErrors:y}}export{E as useField,m as useForm,S as useFormState};
//# sourceMappingURL=index.js.map
