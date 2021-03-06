import "@polymer/paper-input/paper-input.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-textarea.js";
import "@polymer/paper-listbox/paper-listbox.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-radio-group/paper-radio-group.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/paper-radio-group/paper-radio-group.js"; 

import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-iconset-svg/iron-iconset-svg.js";

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

import "./fabric-overlay-field.js";
import "./fabric-alert.js";
import FabricI18n from "./fabric-i18n.js";

if(!Number.prototype.toFileSize)
Object.defineProperty(Number.prototype, 'toFileSize', {
    value: function(a, asNumber){
        var b,c,d;
        var r = (
            a=a?[1e3,'k','B']:[1024,'K','iB'],
            b=Math,
            c=b.log,
            d=c(this)/c(a[0])|0,this/b.pow(a[0],d)
        ).toFixed(2)

        if(!asNumber){
            r += ' '+(d?(a[1]+'MGTPEZY')[--d]+a[2]:'Bytes');
        }
        return r;
    },
    writable:false,
    enumerable:false
});
if(!String.prototype.parseFileSize)
Object.defineProperty(String.prototype, 'parseFileSize', {
    value: function() {
		var scale = 'BKMGTPEZY';
		var s = this;
	    var b = s.search(/[a-zA-Z]/ig);
	    var c = b < 0 ? ['B'] : s.toUpperCase().substring(b).split('');
	    var d = c.shift();
	    var e = c.shift();
	    var n = e == 'I' ? 1024 : 1000;
	    var i = scale.indexOf(d);
	    if(i < 0)
	    	return undefined;
	    var v = eval('parseFloat('+(b < 0 ? s : s.substring(0,b))+')' );
	    v *= (i?Math.pow(n,i):1);
	    return Math.round(v);
	},
    writable:false,
    enumerable:false
});
if(!Number.prototype.toHashMetric)
Object.defineProperty(Number.prototype, 'toHashMetric', {
    value: function(precision, unit, commas) {

		var l = [
			[1e24, 'Y'],
			[1e21, 'Z'],
			[1e18, 'E'],
			[1e15, 'P'],
			[1e12, 'T'],
			[1e9, 'G'],
			[1e6, 'M'],
			[1e3, 'k']
		];

		var i = 0;
		if(unit) {
			while(i < l.length-1 && unit != l[i][1])
				i++;

		}
		else {
			while(i < l.length-1 && (this) < l[i][0])
				i++;
			unit = l[i][1];
		}

		var v = this / l[i][0];
		
		precision = _.isUndefined(precision) ? 2 : parseInt(precision);
		if(commas) {
			var parts = v.toFixed(precision).toString().split('.');
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		    return parts.join('.') + ' ' + unit;
		}
		else {
			return v.toFixed(precision) + ' ' + unit;
		}
    },
    writable:false,
    enumerable:false
});
if(!Number.prototype.toSia)
Object.defineProperty(Number.prototype, 'toSia', {
    value: function(precision, suffix, c) {

		var l = [
			[1e36, 'TS'],
			[1e33, 'GS'],
			[1e30, 'MS'],
			[1e27, 'KS'],
			[1e24, 'SC'],
			[1e21, 'mS'],
			[1e18, 'uS'],
			[1e15, 'nS'],
			[1e12, 'pS'],
			[1e9, 'H']
		];

		var i = 0;
		if(suffix) {
			while(i < l.length-1 && suffix != l[i][1])
				i++;

		}
		else {
			while(i < l.length-1 && (this) < l[i][0])
				i++;
			suffix = l[i][1];
		}

		var v = this / l[i][0];
		precision = _.isUndefined(precision) ? 2 : parseInt(precision);
		if(c) {
			var parts = v.toFixed(precision).toString().split('.');
		    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		    if(parts[1]) parts[1] = parts[1].replace(/0*$/,'');
		    return (parts[1] && parts[1].length ? parts.join('.') : parts[0]) + ' ' + suffix;
		}
		else {
			return v.toFixed(precision).replace(/0*$/,'').replace(/\.$/,'') + ' ' + suffix;
		}
    },
    writable:false,
    enumerable:false
});
if(!String.prototype.parseSia)
Object.defineProperty(String.prototype, 'parseSia', {
    value: function() {
		var siaScale = {
		    "TS" : 1e36,
		    "GS" : 1e33,
		    "MS" : 1e30,
		    "KS" : 1e27,
		    "SC" : 1e24,
		    "mS" : 1e21,
		    "uS" : 1e18,
		    "nS" : 1e15,
		    "pS" : 1e12,
		    "H" : 1e9
		}
		var s = this;
	    var i = s.search(/[a-zA-Z]/ig);
	    var p = i<0?[s,'SC']:[s.substring(0,i),s.substring(i)];
	    var v = bigInt(Math.round(parseFloat(p[0])*1e8));
	    if(p[1]) {
	        var e = siaScale[p[1]];
	        if(!e)
	        	return undefined;
	        v = v.multiply(e);
	    }
	    return v.divide(1e8).toString();
	},
    writable:false,
    enumerable:false
});

Polymer({
	is : 'fabric-field',
	properties : {
		editable: {
			type: String,
			value: false,
			//observer: "onEditableChanged"
		},
		editorHAlign:{type: String, value: "left"},
		allowedPattern: String,
		required: Boolean,
		commas: Boolean,
		title : { type : String },
		value : { type : String, notify:true },
		_value: { type : String },
		suffix : { type : String },
		unit : { type : String },
		precision : { type : Number, value : null },
		type : { type : String, value : null, observer:"onTypeChanged"},
		format : { type : String, value : null },
		inputType:{type: String, value:"text"},
		zeroDefault : { type : String },
		op: {type: String, value: "setting"},
		boolText:{type:String, value:"True/False"},
		radioValues : {type:String},
		_radio : {type:Array, value:[]},
		titleSuffix:{type: String, value: ": "},
		errorState: { type : Boolean, value : false },
		//errorLabel: { type : String }
		_label: { type : String },
		showUnits : { type : Boolean, value : false },
		rpc: Object,
		localSave:Boolean,
		spinner: { type : Boolean, value : false },
		nAValue:{type: String, value: "N/A"},
		horizontalOffset:{type:Number, value:0},
		titleWidthAsHOffset:Boolean,
		fieldItems:{type:Array, value:[]},
		textareaRows:{type:Number, value:2},
		adjustRightEdge:{type:Boolean},
		skipAutoFocus:{type:Boolean}
	},
	observers:["onValueChanged(value)"],
	behaviors: [FabricI18n],
	_template: html`
		<style include="fabric-style">
			:host {
				display: block;
				--fabric-overlay-field-tigger:{
					min-height: 10px;
				}
			}
			.wrapper {
				padding: 4px 6px 4px 6px; font-size:0px; white-space: nowrap;
				@apply --fabric-field-wrapper;
			}
			.dropdown-trigger{
				@apply --layout-horizontal;
				@apply --layout-center;
				@apply --fabric-field-trigger;
			}
			.title { font-size: 14px; @apply --fabric-field-title;}
			.value { font-size: 12px; color: #025975; @apply --fabric-field-value;}
			.suffix { color: #025975; padding-left:5px; @apply --fabric-field-suffix;}
			.dropdown-trigger iron-icon{width: 12px; height: 12px;@apply --fabric-field-icon;}
			fabric-overlay-field{padding-bottom:0px;}
			fabric-overlay-field[disabled]{cursor:default;}
			[is-editable] .dropdown-trigger>.title{
				color:#0003C4;
				@apply --fabric-field-editable-title;
			}
			/*#editor::shadow .dropdown-content : {overflow:hidden;}*/
			#editor .no-overflow { overflow: hidden; }
			.editor-error { border: 1px solid red; }
			#editor::shadow paper-input.editor-error::shadow label { color: red; }
			#paper paper-icon-button{margin-top:5px;@apply --fabric-field-paper-icon-button}
			.dropdown-content{
				@apply --fabric-field-dropdown-content;
				--paper-input-container:{
					padding-bottom:0px;
					padding:0px;
				}
				--paper-input-container-label:{
					padding-left:5px;
				}
				--paper-input-container-input:{
					padding:0px 5px;
				}
			}
			.dropdown-content.h-center{
				@apply --layout-horizontal;
				@apply --layout-center;
				@apply --fabric-field-dropdown-content-h-center;
			}
			.spinner-slot{
				@apply --layout-horizontal;
				@apply --layout-center;
				@apply --fabric-field-spinner-slot;
			}
			#spinnerContainer{
                @apply --layout-vertical;
                width: 1.4em;
                height: 100%;
                padding:0;
                margin:0;
                vertical-align: middle;
                min-height: 24px;
                margin-right:5px;
                @apply --fabric-field-spinners;
            }
            #incButton,
            #decButton{
                min-height:12px;
                font-size:60%;
                padding:0;
                margin:0;
                cursor:pointer;
                min-width:0px;
                text-align:center;
                background-color:#ddd;
                border-radius:0px;
                @apply --layout-horizontal;
                @apply --layout-flex;
                @apply --fabric-field-spinner;
            }
            .h-box{@apply --layout-horizontal;}
            .flex{@apply --layout-flex;}
            .select-box-outer{
            	max-height:300px;
            	@apply --layout-vertical;
            	@apply --fabric-field-select-box-outer;
            }
            .select-box{
            	overflow: auto;
            	max-height:200px;
            	@apply --fabric-field-select-box;
            }
            .select-box paper-item{cursor:pointer;@apply --fabric-field-select-box-item;}
            .select-box-btns{
            	border-top:1px solid #DDD;
            	@apply --layout-horizontal;
            	@apply --fabric-field-select-box-btns;
            }
            .textarea-outer{
            	max-height:300px;
            	max-width:400px;
            	min-width:250px;
            	@apply --layout-vertical;
            	@apply --fabric-field-textarea-outer;
            }
            .textarea-box{
            	overflow-x:hidden;
            	overflow-y: auto;
            	max-height:300px;
            	@apply --fabric-field-textarea-box;
            }
            .textarea-btns{
            	border-top:1px solid #DDD;
            	@apply --layout-horizontal;
            	@apply --fabric-field-select-box-btns;
            }
            .textarea-box{
            	--paper-input-container-input:{
	            	padding:0px;
	            }
	            --iron-autogrow-textarea:{
	            	box-sizing:border-box;
	            	padding:5px;
	            }
            }
            [is-select-field]{
            	--fabric-overlay-field-dropdown-content:{
            		max-height:300px !important;
            	}
            }
		</style>
		<div class='wrapper' is-editable$="[[_isEditable(editable)]]" is-select-field$="[[_isSelectField(format, type)]]">
			<fabric-overlay-field on-iron-overlay-opened="onOverlayOpened" adjust-right-edge="[[adjustRightEdge]]" horizontal-align="[[editorHAlign]]" horizontal-offset="[[horizontalOffset]]" id="editor" disabled$="[[_isDisabled(editable)]]">
				<template is="dom-if" if="{{spinner}}">
					<span class="spinner-slot" slot="spinner-slot">
						<span id="title" class='title'>[[title]]<span>[[titleSuffix]]</span></span>
						 <div id="spinnerContainer">
							<paper-button on-mouseleave="onSpinerMouseUp" on-mouseup="onSpinerMouseUp" on-mousedown="onSpinerMouseDown" id="incButton" data-spin="up">&#9650;</paper-button>
							<paper-button on-mouseleave="onSpinerMouseUp" on-mouseup="onSpinerMouseUp" on-mousedown="onSpinerMouseDown" id="decButton" data-spin="down">&#9660;</paper-button>
						</div>
					</span>
					<span slot="dropdown-trigger" class="dropdown-trigger">
						<span class='value'>[[_V(value)]]</span><span class="units" hidden$="[[!showUnits]]">[[_getUnits(format)]]</span><span class="suffix" hidden$="[[!suffix]]">[[suffix]]</span>
						<iron-icon icon="arrow-drop-down" hidden$="[[!editable]]"></iron-icon>
					</span>
				</template>
				
				<template is="dom-if" if="{{!spinner}}">
					<span slot="dropdown-trigger" class="dropdown-trigger">
						<span id="title" class='title'>[[title]]<span>[[titleSuffix]]</span></span>
						<span class='value'>[[_V(value)]]</span><span class="units" hidden$="[[!showUnits]]">[[_getUnits(format)]]</span><span class="suffix" hidden$="[[!suffix]]">[[suffix]]</span>
						<iron-icon icon="arrow-drop-down" hidden$="[[!editable]]"></iron-icon>
					</span>
				</template>
				<template is="dom-if" if="[[_isBoolField(format, type)]]">
					<div slot="dropdown-content" class="dropdown-content h-center bg-color no-overflow">
						<paper-radio-group selected="{{_value}}" attr-for-selected="value">
							<paper-radio-button name="a" value="1">[[getBooleanText(1)]]</paper-radio-button>
							<paper-radio-button name="b" value="0">[[getBooleanText(0)]]</paper-radio-button>
						</paper-radio-group>
						<paper-icon-button icon="close" slot="suffix" close on-click="cancelSetting"></paper-icon-button>
						<paper-icon-button icon="done" slot="suffix" on-click="saveSetting"></paper-icon-button>
					</div>
				</template>
				<template is="dom-if" if="[[_isRadioField(format)]]">
					<div slot="dropdown-content" class="dropdown-content h-center bg-color no-overflow">
						<paper-radio-group selected="{{_value}}" attr-for-selected="value">
							<template is="dom-repeat" items="[[_radio]]">
								<paper-radio-button name="[[item.name]]" value="[[item.value]]">[[item.name]]</paper-radio-button>
							</template>
						</paper-radio-group>
						<paper-icon-button icon="close" slot="suffix" close on-click="cancelSetting"></paper-icon-button>
						<paper-icon-button icon="done" slot="suffix" on-click="saveSetting"></paper-icon-button>
					</div>
				</template>
				<template is="dom-if" if="[[_isSelectField(format, type)]]">
					<div slot="dropdown-content" class="dropdown-content bg-color no-overflow">
						<div class="select-box-outer">
							<paper-listbox class="select-box" multi="[[_isMultiSelectField(format, type)]]" selected="{{_value}}" attr-for-selected="value">
								<template is="dom-repeat" items="[[fieldItems]]">
									<paper-item value="[[item.value]]">[[item.text]]</paper-item>
								</template>
							</paper-listbox>
							<div class="select-box-btns">
								<paper-icon-button icon="close" slot="suffix" close on-click="cancelSetting"></paper-icon-button>
								<paper-icon-button icon="done" slot="suffix" on-click="saveSetting"></paper-icon-button>
							</div>
						</div>
					</div>
				</template>
				<template is="dom-if" if="[[_isTextareaField(format, type)]]">
					<div slot="dropdown-content" class="dropdown-content bg-color no-overflow">
						<div class="textarea-outer">
							<paper-textarea no-label-float="true" class="textarea-box" value="{{_value}}" rows="[[textareaRows]]">
							</paper-textarea>
							<div class="textarea-btns">
								<paper-icon-button icon="close" slot="suffix" close on-click="cancelSetting"></paper-icon-button>
								<paper-icon-button icon="done" slot="suffix" on-click="saveSetting"></paper-icon-button>
							</div>
						</div>
					</div>
				</template>
				<template is="dom-if" if="[[_isEditField(format, type)]]">
					<paper-input
						id="paper"
						slot="dropdown-content"
						class="dropdown-content"
						value="{{_value}}"
						allowed-pattern="[[allowedPattern]]" 
						required$="[[required]]"
						label="[[_title]]"
						no-label-float$="[[!errorState]]"
						on-keydown="checkForEnter"
						floatingLabel$="[[errorState]]"
						type="[[inputType]]"
						>
						<paper-icon-button icon="close" slot="suffix" close on-click="cancelSetting"></paper-icon-button>
						<paper-icon-button icon="done" slot="suffix" on-click="saveSetting"></paper-icon-button>
					</paper-input>
				</template>
			</fabric-overlay-field>
		</div>`,
	ready : function() {
		if(this.titleWidthAsHOffset)
			this.horizontalOffset = this.$.title.getBoundingClientRect().width;
		this.init();
	},
	onTypeChanged: function(){
		if(this.type === Number){
			this.set("allowedPattern", "[0-9]");
		}
	},
	onOverlayOpened:function(e){
		if(this.skipAutoFocus)
			return
		var input = this.$.editor.querySelector("paper-input,paper-textarea,paper-listbox,paper-radio-group");
		if(!input)
			return
		input.focus();
	},
	init: function(){
		if(this.__init)
			return
		this.__init = true;
		this._title = this.title;
		if(this.radioValues) {
			var radio = [ ]
			var items = this.radioValues.split('|');
			_.each(items, function(item) {
				var parts = item.split(':')
				radio.push({
					value : parts.shift(),
					name : parts.shift()
				})
			})

			this.set("_radio", radio);
		}
	},
	onSpinerMouseDown: function ( e ) {

		var spin = $( e.target ).attr( "data-spin" );
		this.spinnerInterval = setInterval( () => {

				this.fire("spinner-change", { spin: spin } )

		}, 100 );
	},
	onSpinerMouseUp: function () {

		// console.log( this.spinnerInterval )
		if( this.spinnerInterval ) {
			clearInterval( this.spinnerInterval );
		}
	},
	onValueChanged: function(){
		this.init();
		if (this._isSiaCoinField() || this._isTimeField() || this._isFileSize())
			this.set("_value", this._V(this.value));
		else
			this.set("_value", this.value);
	},
	_getUnits: function(u, suffix) {
		//suffix = suffix || '';
		if(_.contains(['h','hbb','htb'],u))
			return ' [SC] ';
		if(u == 'file-size-si')
			return ' [Bytes - Metric: TB, GB, KB...] ';
		if(u == 'file-size')
			return ' [Bytes - Binary: TiB, GiB, KiB...] ';
		return '';
	},
	_isBoolField: function(format, type){
		return this.format == "bool" || this.type === Boolean;
	},
	_isRadioField: function(format) {
		return this.format == "radio";
	},
	_isSelectField:function(format, type){
		return this.type == "multi-select" || this.type == "select";
	},
	_isMultiSelectField:function(format, type){
		return this.type == "multi-select";
	},
	_isTextareaField:function(format, type){
		return this.type == "multi-line";
	},
	_isEditField : function(format, type) {
		return !this._isTextareaField() && !this._isSelectField(format, type) &&
			!this._isBoolField(format, type) && !this._isRadioField(format);
	},
	_isFileSize: function(){
		var f = (this.format || "").toLowerCase();
		return f == "file-size" || f == "file-size-si";
	},
	_isSiaCoinField: function(){
		var f = (this.format || "").toLowerCase();
		return f == "h" || f == "sc" || f == "hbb" || f == "htb";
	},
	_isSC: function(){
		var f = (this.format || "").toLowerCase();
		return f == "sc";
	},
	_isHBB: function(){
		var f = (this.format || "").toLowerCase();
		return f == "hbb";
	},
	_isHTB: function(){
		var f = (this.format || "").toLowerCase();
		return f == "htb";
	},
	_isTimeField : function() {
		var f = (this.format || "").toLowerCase();
		return f == "days" || f == "hrs";
	},
	_isEditable: function(editable){
		return !!editable;
	},
	_isDisabled: function(){
		return !this.editable;
	},
	_C : function(v, precision) {
		var parts = parseFloat(v).toFixed(parseInt(precision)).toString().split('.');
	    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	    return parts.join('.');
	},
	_SC : function(_v, precision) {
		return parseFloat(_v).toSia(precision || 0, false, true);
	},
	_HBB : function(_v, precision) {
		return parseFloat(bigInt(_v).multiply(4320).multiply(1e12).toString()).toSia(precision || 4, false, true);
	},
	_HTB : function(_v, precision) {
		return parseFloat(bigInt(_v).multiply(1e12).toString()).toSia(precision || 4, false, true);
	},
	_V : function(v) {
		//console.log(this.title,v,typeof v, this.type)
		if (this._isBoolField() || _.isBoolean(v)) {
			if (v === "")
				return this.nAValue;

			return this.getBooleanText(!!v);
		}
		else
		if(this._isRadioField()) {
			return this.getRadioText(v);
		}
		else
		if(!_.isNumber(v) && v == '') {
			return this.nAValue;
		}

		if(_.isUndefined(v) || v == this.nAValue) {
			return this.nAValue;
		}
		var precision = 0;
		if(!_.isUndefined(this.precision))
			precision = parseInt(this.precision);
		if(!this.format){
			if(this.commas)
				return this._C(v, precision);
			else if(precision)
				return parseFloat(v).toFixed(precision);
			else if(this.valueLength)
				return parseFloat(v).toPrecision(parseInt(this.valueLength));
		}
			

		var format = this.format ? this.format.toLowerCase() : null;
		var n = {
			k: this._T("Thousand"),
			M: this._T("Million"),
			G: this._T("Billion"),
			T: this._T("Trillion"),
			P: this._T("Quadrillion"),
			E: this._T("Quintillion"),
			Z: this._T("Sextillion"),
			Y: this._T("Septillion")
		}
		switch(format) {
			case 'duration' : {
			   	let hrs = Math.floor(v/60/60);
				let min = Math.floor(v/60%60);
				let sec = Math.floor(v%60);

				if(!hrs && !min && !sec)
				 	return (this.zeroDefault ? this.zeroDefault : this._C(v) );

			   	let t = '';
			   	// if(hrs) t += (hrs < 10 ? '0'+hrs : hrs) + ':';
			   	// if(hrs || min) t += (min < 10 ? '0'+min : min) + ':';
			   	// if(hrs || min || sec) t += (sec < 10 ? '0'+sec : sec) + '';

			   	if(hrs) t += (hrs < 10 ? '0'+hrs : hrs) + ' h ';
			   	if(hrs || min) t += (min < 10 ? '0'+min : min) + ' m ';
			   	if(hrs || min || sec) t += (sec < 10 ? '0'+sec : sec) + ' s ';

			   	return t;
			} break;
			case 'cs': return this._C(v);
			case 'fiat': return this._C(v, 2);
			case 'btc': return this._C(v, 8);
			case 'sc': return this._SC(v*1e24, this.precision);
			case 'h': return this._SC(v, this.precision);
			case 'hbb': return this._HBB(v, this.precision);
			case 'htb': return this._HTB(v, this.precision);
			case 'int': return this._C(parseInt(v));
			case 'days': return Math.round(v / 6 / 24);
			case 'hrs': return Math.round(v / 6);
			case "large-number":
				v = parseFloat(v).toHashMetric(this.precision, this.unit, this.commas);
				_.find(n, function(name, key){
					if (v.indexOf(key) > 0) {
						v = v.replace(key, " "+name);
						return true;
					}
				});
				return v;
			break;
			case 'file-size-si': return parseFloat(v).toFileSize(true);
			case 'file-size': return parseFloat(v).toFileSize();
			case 'hash-rate': return parseFloat(v).toHashMetric(this.precision, this.unit, this.commas) + "H/s";
			case 'difficulty': return parseFloat(v).toHashMetric(this.precision, this.unit, this.commas) + "H";

			default: {
				if(this.precision)
					return parseFloat(v).toFixed(parseInt(this.precision));
				
				return v;
			}
		}
		
	},
	getBooleanText: function(v) {
		var boolText = this.boolText.split("/");
		return v ? boolText[0] : boolText[1];
	},
	getRadioText: function(v){
		if(this._isRadioField()) {
			this.init();
			var o = _.find(this.get("_radio"), function(item) {
				if(item.value == v)
					return true;
				return false;
			})
			return o ? o.name : "ERROR";
		}
	},
	checkForEnter: function(e) {
		if(e.keyCode === 13)
			this.saveSetting();
		else
		if(this.errorState)
			this.hideError();
	},
	showError: function(err) {
		if(this._isEditField()) {
			this.set("errorState",true);
			this.set("_title",err);
			this.root.querySelector("#paper").toggleClass("editor-error", true);
		}else{
			Fabric.Alert({title: this._T("Error"), text: err })
		}
	},
	hideError: function(err) {
		if(this._isEditField()) {
			this.set("errorState",false);
			this.set("_title",this.title);
			this.root.querySelector("#paper").toggleClass("editor-error", false);
		}
	},
	cancelSetting: function(){
		this.hideError();
		this.$.editor.close();
		this.onValueChanged();
	},
	saveSetting: function(){

		this.$.editor.toggleClass("saving", true);
		var value = this._value;
		if (this._isBoolField())
			value = value == "1";
		else if (this._isFileSize() ){
			value = value.parseFileSize();

			if (_.isUndefined(value) || _.isNaN(value)){
				this.showError(this._T("Invalid Value"))
				return;
			}
		}
		else if (this._isSiaCoinField() ){
			value = value.parseSia();
			if (_.isUndefined(value) || _.isNaN(value)){
				this.showError(this._T("Invalid Value"))
				return;
			}

			if(this._isHBB()) {
				value = bigInt(Math.round(value*1000)).divide(1e15).divide(4320).toString();
			}
			else
			if(this._isHTB()) {
				value = bigInt(Math.round(value*1000)).divide(1e15).toString();
			}
			else
			if(this._isSC()) {
				value /= 1e24;
			}
		}
		else if(this._isTimeField()) {
			var f = (this.format || "").toLowerCase();

			if(f == 'days')
				value = Math.round(value * 24 * 6);
			else
			if(f == 'hrs')
				value = Math.round(value * 6);
		}

		if(this.processBeforeSave)
			value = this.processBeforeSave(value, this.editable, this)
		if(this.checkBeforeSave && !this.checkBeforeSave(value, this.value)){
			this.$.editor.close();
			return
		}

		if(this.localSave){
			if(this.value !== value){
				this.set("value", value);
				this.fire(this.is+"-value-changed", {value: value, editable:this.editable, field: this});
				this.fire("change", {value: value, editable:this.editable, field: this})
				this.fire("changed", {value: value, editable:this.editable, field: this})
			}
			this.$.editor.close();
			return
		}


		this.rpc.dispatch({
			op:this.op,
			name: this.editable,
			value: value
		}, (err, r)=>{
			//console.log("arguments", r);
			this.$.editor.toggleClass("saving", false);

			if(err) {
				if(_.isString(err) && err.match(/no such stream/))
					err = this._T("Error: Not Connected to Node");
				//this.showError(err.error ? err.error.toString() : err.toString());
				var text = err.error ? err.error.toString() : err.toString();
				if(App.isDemo)
					Fabric.info({ title : "DEMO", text : text, autoHide : App.isDemo });
				else
					Fabric.error({ title : "Error", text : text, autoHide : App.isDemo });

				return;
			}

			this.set("value", r.value);
			this.fire(this.is+"-value-changed", {value: r.value, editable:this.editable, field: this});
			this.fire("change", {value: value, editable:this.editable, field: this})
			this.$.editor.close();
		})
	}
})

