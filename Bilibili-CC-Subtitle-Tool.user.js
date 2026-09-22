// ==UserScript==
// @name         Bilibili CC字幕批量下载复制查看器
// @namespace    indefined
// @updateURL    https://raw.githubusercontent.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/main/Bilibili-CC-Subtitle-Tool.user.js
// @downloadURL  https://raw.githubusercontent.com/WanderLandWalker/Bilibili-CC-Subtitle-Tool/main/Bilibili-CC-Subtitle-Tool.user.js
// @version      1.0
// @description  支持B站CC字幕单集与合集/选集批量下载、语言切换、复制查看、多格式导出、窗口拖动和悬浮按钮
// @author       Wanderland Walker
// @match        http*://www.bilibili.com/video/*
// @match        http*://www.bilibili.com/bangumi/play/ss*
// @match        http*://www.bilibili.com/bangumi/play/ep*
// @match        https://www.bilibili.com/cheese/play/ss*
// @match        https://www.bilibili.com/cheese/play/ep*
// @match        http*://www.bilibili.com/list/watchlater*
// @match        https://www.bilibili.com/medialist/play/watchlater/*
// @match        http*://www.bilibili.com/medialist/play/ml*
// @match        http*://www.bilibili.com/blackboard/html5player.html*
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const elements = {
        subtitleStyle:`
<style type="text/css">
/*对齐，悬停按钮显示菜单*/
#subtitle-setting-panel>div>* {margin-right: 5px;}
#bilibili-player-subtitle-btn:hover>#subtitle-setting-panel {display: block!important;}
/*滑动选择样式*/
#subtitle-setting-panel input[type="range"] {
  background-color: #ebeff4;
  -webkit-appearance: none;
  height:4px;
  transform: translateY(-4px);
}
#subtitle-setting-panel input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  background: #fff;
  border-radius: 15px;
  border: 1px solid;
}
/*复选框和其对应标签样式*/
#subtitle-setting-panel input[type="checkbox"]{display:none;}
#subtitle-setting-panel input ~ label {cursor:pointer;}
#subtitle-setting-panel input:checked ~ label:before {content: '\\2714';}
#subtitle-setting-panel input ~ label:before{
  width: 12px;
  height:12px;
  line-height: 14px;
  vertical-align: text-bottom;
  border-radius: 3px;
  border:1px solid #d3d3d3;
  display: inline-block;
  text-align: center;
  content: ' ';
}
/*悬停显示下拉框样式*/
#subtitle-setting-panel .bpui-selectmenu:hover .bpui-selectmenu-list{display:block;}
/*滚动条样式*/
#subtitle-setting-panel ::-webkit-scrollbar{width: 7px;}
#subtitle-setting-panel ::-webkit-scrollbar-track{border-radius: 4px;background-color: #EEE;}
#subtitle-setting-panel ::-webkit-scrollbar-thumb{border-radius: 4px;background-color: #999;}
/* 新增：拖动时的样式 */
#subtitle-download-dialog.dragging {
    cursor: grabbing !important;
    user-select: none;
}
#subtitle-download-dialog.dragging textarea {
    pointer-events: none;
}
/* 新增：复制按钮样式 */
.copy-clipboard-btn {
    background: #00a1d6 !important;
    margin-left: 5px;
}
.copy-clipboard-btn:hover {
    background: #00a1d6 !important;
}
.copy-success-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.8);
    color: #fff;
    padding: 20px 40px;
    border-radius: 8px;
    font-size: 16px;
    z-index: 1048577;
    animation: fadeInOut 2s ease;
}
@keyframes fadeInOut {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
}
/* 字幕框右下角的明显缩放手柄 */
.subtitle-textarea-resize-box {
    position: relative;
    width: 500px;
    min-width: 310px;
    height: 410px;
    min-height: 180px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 170px);
}
.subtitle-textarea-resize-box textarea {
    width: 100% !important;
    height: 100% !important;
    box-sizing: border-box;
    resize: none !important;
}
.subtitle-resize-handle {
    position: absolute;
    right: 3px;
    bottom: 3px;
    width: 28px;
    height: 28px;
    border: 2px solid #fff;
    border-radius: 5px;
    background: #00a1d6;
    box-shadow: 0 1px 5px rgba(0,0,0,.35);
    color: #fff;
    cursor: nwse-resize;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: bold;
    line-height: 1;
    z-index: 2;
    user-select: none;
}
.subtitle-resize-handle:hover,
.subtitle-resize-handle.active {
    background: #008fbe;
    transform: scale(1.08);
}
</style>`,
        oldEnableIcon:`
<svg width="22" height="28" viewbox="0 0 22 30" xmlns="http://www.w3.org/2000/svg">
  <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m4.07787,6.88102l14,0a2,2 0 0 1 2,2l0,10a2,2 0 0 \
1 -2,2l-14,0a2,2 0 0 1 -2,-2l0,-10a2,2 0 0 1 2,-2zm5,5.5a1,1 0 1 0 0,-2l-3,0a2,2 0 0 0 -2,2l0,3a2,2 0 0 0 \
2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0zm8,0a1,1 0 0 0 0,-2l-3,0a2,2 0 0 0 -2,2l0\
,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,-1l0,-1a1,1 0 0 1 1,-1l2,0z"/></svg>`,
        oldDisableIcon:`
<svg width="22" height="28" viewBox="0 0 22 32" xmlns="http://www.w3.org/2000/svg">
  <path id="svg_1" fill-rule="evenodd" fill="#99a2aa" d="m15.172,21.87103l-11.172,0a2,2 0 0 1 -2,-2l0,-10c0,\
-0.34 0.084,-0.658 0.233,-0.938l-0.425,-0.426a1,1 0 1 1 1.414,-1.414l15.556,15.556a1,1 0 0 1 -1.414,1.414l-2.192,\
-2.192zm-10.21,-10.21c-0.577,0.351 -0.962,0.986 -0.962,1.71l0,3a2,2 0 0 0 2,2l3,0a1,1 0 0 0 0,-2l-2,0a1,1 0 0 1 -1,\
-1l0,-1a1,1 0 0 1 0.713,-0.958l-1.751,-1.752zm1.866,-3.79l11.172,0a2,2 0 0 1 2,2l0,10c0,0.34 -0.084,0.658 -0.233,\
0.938l-2.48,-2.48a1,1 0 0 0 -0.287,-1.958l-1.672,0l-1.328,-1.328l0,-0.672a1,1 0 0 1 1,-1l2,0a1,1 0 0 0 0,-2l-3,\
0a2,2 0 0 0 -1.977,1.695l-5.195,-5.195z"/></svg>`,
        newDisableIcon:`
        <svg class="squirtle-svg-icon" viewBox="0 0 28 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <path d="M6.998,4 L10.118,7.123 L9.5605,7.1235 C9.4135,6.777 9.151,6.3465 8.8885,6 L7.933,6.3045 C8.101,6.546 8.269,6.8505 8.4055,7.1235 L4.3945,7.1235 L4.3945,9.3705 L5.35,9.3705 L5.35,8.0475 L11.042,8.047 L12.206,9.212 L12.2065,9.3705 L12.364,9.37 L14.494,11.502 L14.389,11.502 L14.389,12.2685 L15.259,12.268 L15.7076026,12.7152226 C15.273892,12.9780418 14.772314,13.2154154 14.2,13.413 C14.3785,13.5705 14.641,13.9275 14.746,14.148 C15.2185,13.959 15.6385,13.7595 16.027,13.5285 L16.027,15.5025 L16.9615,15.5025 L16.961,13.971 L18.536,15.547 L18.5365,15.7125 L18.701,15.712 L20.987,18 L4,18 C2.8954305,18 2,17.1045695 2,16 L2,6 C2,4.8954305 2.8954305,4 4,4 L6.998,4 Z M24,4 C25.1045695,4 26,4.8954305 26,6 L26,16 C26,17.1045695 25.1045695,18 24,18 L23.814,18 L21.2866753,15.470484 C21.499408,15.4571242 21.672579,15.4281871 21.8125,15.366 C22.096,15.24 22.1695,15.0405 22.1695,14.631 L22.1695,13.5915 C22.5475,13.812 22.957,13.98 23.3665,14.106 C23.482,13.8855 23.7445,13.539 23.944,13.3815 C23.0725,13.2675 22.201,12.8685 21.5605,12.2685 L23.7025,12.2685 L23.7025,11.502 L18.2635,11.502 C18.3685,11.3445 18.4735,11.187 18.568,11.019 L22.6,11.019 L22.6,8.079 L15.565,8.079 L15.564,9.743 L13.204,7.381 L13.204,7.1235 L12.946,7.123 L9.825,4 L24,4 Z M11.0725,9.045 L10.852,9.0975 L6.043,9.0975 L6.043,10.0005 L9.865,10.0005 C9.3925,10.3995 8.815,10.809 8.2795,11.0715 L8.2795,11.6805 L4.3,11.6805 L4.3,12.615 L8.2795,12.615 L8.2795,14.547 C8.2795,14.673 8.23321429,14.7295714 8.10096939,14.7431633 L7.788625,14.7522422 C7.4696875,14.7556875 6.938125,14.75175 6.442,14.736 C6.5995,14.988 6.799,15.429 6.862,15.7125 L7.348864,15.710148 C7.95904,15.70242 8.416,15.6705 8.752,15.5445 C9.1825,15.3975 9.319,15.1245 9.319,14.5785 L9.319,12.615 L13.2985,12.615 L13.2985,11.6805 L9.319,11.6805 L9.319,11.397 C10.2115,10.8825 11.0935,10.2 11.734,9.549 L11.0725,9.045 Z M21.235,13.77 L21.235,14.6205 C21.235,14.7255 21.193,14.757 21.0775,14.757 L20.574025,14.7533985 L20.569,14.753 L19.587,13.77 L21.235,13.77 Z M20.5105,12.2685 C20.731,12.531 20.9935,12.7725 21.2875,13.0035 L19.4815,13.0035 L19.4815,12.4575 L18.5365,12.4575 L18.536,12.718 L18.087,12.268 L20.5105,12.2685 Z M16.839,11.019 L17.497,11.019 C17.4212405,11.1536835 17.3319842,11.2816187 17.2292312,11.4082156 L16.839,11.019 Z M21.6235,9.822 L21.6235,10.4205 L16.4995,10.4205 L16.4995,9.822 L21.6235,9.822 Z M21.6235,8.6775 L21.6235,9.255 L16.4995,9.255 L16.4995,8.6775 L21.6235,8.6775 Z M17.791,6.084 L16.8355,6.084 L16.8355,6.7035 L14.452,6.7035 L14.452,7.491 L16.8355,7.491 L16.8355,7.89 L17.791,7.89 L17.791,7.491 L20.269,7.491 L20.269,7.89 L21.2245,7.89 L21.2245,7.491 L23.6605,7.491 L23.6605,6.7035 L21.2245,6.7035 L21.2245,6.084 L20.269,6.084 L20.269,6.7035 L17.791,6.7035 L17.791,6.084 Z" id="形状结合" fill="#FFFFFF"></path>
              </g>
            </svg>`,
        newEnableIcon:`
        <svg class="squirtle-svg-icon" viewBox="0 0 28 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                  <g transform="translate(2.000000, 0.000000)" fill="#FFFFFF">
                      <path d="M22,3.5 C23.1045695,3.5 24,4.3954305 24,5.5 L24,16.5 C24,17.6045695 23.1045695,18.5 22,18.5 L2,18.5 C0.8954305,18.5 1.3527075e-16,17.6045695 0,16.5 L0,5.5 C-1.3527075e-16,4.3954305 0.8954305,3.5 2,3.5 L22,3.5 Z M9.018,9.1515 L8.7975,9.204 L3.9885,9.204 L3.9885,10.107 L7.8105,10.107 C7.338,10.506 6.7605,10.9155 6.225,11.178 L6.225,11.787 L2.2455,11.787 L2.2455,12.7215 L6.225,12.7215 L6.225,14.6535 C6.225,14.8005 6.162,14.853 5.973,14.853 C5.9065,14.8565 5.78166667,14.8588333 5.62027778,14.8596111 L5.3535,14.8595625 C5.06475,14.85825 4.71825,14.853 4.3875,14.8425 C4.545,15.0945 4.7445,15.5355 4.8075,15.819 C5.6685,15.819 6.2775,15.8085 6.6975,15.651 C7.128,15.504 7.2645,15.231 7.2645,14.685 L7.2645,12.7215 L11.244,12.7215 L11.244,11.787 L7.2645,11.787 L7.2645,11.5035 C8.157,10.989 9.039,10.3065 9.6795,9.6555 L9.018,9.1515 Z M20.799,8.1855 L13.764,8.1855 L13.764,11.1255 L15.696,11.1255 C15.6015,11.2935 15.486,11.451 15.3495,11.6085 L12.588,11.6085 L12.588,12.375 L14.5515,12.375 C13.995,12.816 13.281,13.215 12.399,13.5195 C12.5775,13.677 12.84,14.034 12.945,14.2545 C13.4175,14.0655 13.8375,13.866 14.226,13.635 L14.226,15.609 L15.1605,15.609 L15.1605,13.8765 L16.7355,13.8765 L16.7355,15.819 L17.6805,15.819 L17.6805,13.8765 L19.434,13.8765 L19.434,14.727 C19.434,14.832 19.392,14.8635 19.2765,14.8635 L19.15575,14.8633359 C18.9962813,14.8628437 18.7305,14.860875 18.447,14.853 C18.552,15.0735 18.657,15.357 18.699,15.588 C19.308,15.588 19.728,15.5985 20.0115,15.4725 C20.295,15.3465 20.3685,15.147 20.3685,14.7375 L20.3685,13.698 C20.7465,13.9185 21.156,14.0865 21.5655,14.2125 C21.681,13.992 21.9435,13.6455 22.143,13.488 C21.2715,13.2675 20.4,12.8685 19.7595,12.375 L21.9015,12.375 L21.9015,11.6085 L16.4625,11.6085 C16.5675,11.451 16.6725,11.2935 16.767,11.1255 L20.799,11.1255 L20.799,8.1855 Z M18.7095,12.375 C18.93,12.6375 19.1925,12.879 19.4865,13.11 L17.6805,13.11 L17.6805,12.564 L16.7355,12.564 L16.7355,13.11 L15.0135,13.11 C15.318,12.879 15.591,12.6375 15.8325,12.375 L18.7095,12.375 Z M19.8225,9.9285 L19.8225,10.527 L14.6985,10.527 L14.6985,9.9285 L19.8225,9.9285 Z M6.834,6.1065 L5.8785,6.411 C6.0465,6.6525 6.2145,6.957 6.351,7.23 L2.34,7.23 L2.34,9.477 L3.2955,9.477 L3.2955,8.154 L10.152,8.154 L10.152,9.477 L11.1495,9.477 L11.1495,7.23 L7.506,7.23 C7.359,6.8835 7.0965,6.453 6.834,6.1065 Z M19.8225,8.784 L19.8225,9.3615 L14.6985,9.3615 L14.6985,8.784 L19.8225,8.784 Z M15.99,6.1905 L15.0345,6.1905 L15.0345,6.81 L12.651,6.81 L12.651,7.5975 L15.0345,7.5975 L15.0345,7.9965 L15.99,7.9965 L15.99,7.5975 L18.468,7.5975 L18.468,7.9965 L19.4235,7.9965 L19.4235,7.5975 L21.8595,7.5975 L21.8595,6.81 L19.4235,6.81 L19.4235,6.1905 L18.468,6.1905 L18.468,6.81 L15.99,6.81 L15.99,6.1905 Z" id="形状结合"></path>
                  </g>
              </g>
            </svg>`,
        createAs(nodeType,config,appendTo){
            const element = document.createElement(nodeType);
            config&&this.setAs(element,config);
            appendTo&&appendTo.appendChild(element);
            return element;
        },
        setAs(element,config,appendTo){
            config&&Object.entries(config).forEach(([key, value])=>{
                element[key] = value;
            });
            appendTo&&appendTo.appendChild(element);
            return element;
        },
        getAs(selector,config,appendTo){
            if(selector instanceof Array) {
                return selector.map(item=>this.getAs(item));
            }
            const element = document.body.querySelector(selector);
            element&&config&&this.setAs(element,config);
            element&&appendTo&&appendTo.appendChild(element);
            return element;
        },
        createSelector(config,appendTo){
            const selector = this.createAs('div',{
                className:"bilibili-player-block-string-type bpui-component bpui-selectmenu selectmenu-mode-absolute",
                style:"width:"+config.width
            },appendTo),
                  selected = config.datas.find(item=>item.value==config.initValue),
                  label = this.createAs('div',{
                      className:'bpui-selectmenu-txt',
                      innerHTML: selected?selected.content:config.initValue
                  },selector),
                  arraw = this.createAs('div',{
                      className:'bpui-selectmenu-arrow bpui-icon bpui-icon-arrow-down'
                  },selector),
                  list = this.createAs('ul',{
                      className:'bpui-selectmenu-list bpui-selectmenu-list-left',
                      style:`max-height:${config.height||'100px'};overflow:hidden auto;white-space:nowrap;`,
                      onclick:e=>{
                          label.dataset.value = e.target.dataset.value;
                          label.innerHTML = e.target.innerHTML;
                          config.handler(e.target.dataset.value);
                      }
                  },selector);
            config.datas.forEach(item=>{
                this.createAs('li',{
                    className:'bpui-selectmenu-list-row',
                    innerHTML:item.content
                },list).dataset.value = item.value;
            });
            return selector;
        },
        createRadio(config,appendTo){
            this.createAs('input',{
                ...config,type: "radio",style:"cursor:pointer;5px;vertical-align: middle;"
            },appendTo);
            this.createAs('label',{
                style:"margin-right: 5px;cursor:pointer;vertical-align: middle;",
                innerText:config.value
            },appendTo).setAttribute('for',config.id);
        }
    };

    // ==================== 公共UI工具：拖拽与状态管理 ====================
    const uiManager = {
        dragMap: new WeakMap(),
        makeDraggable(handle, container, options = {}) {
            const state = { isDragging: false, offsetX: 0, offsetY: 0 };
            const onMouseDown = (e) => {
                if (e.target.closest('button, a, select, input, textarea, [data-no-drag]')) return;
                e.preventDefault();
                e.stopPropagation();
                state.isDragging = true;
                const rect = container.getBoundingClientRect();
                state.offsetX = e.clientX - rect.left;
                state.offsetY = e.clientY - rect.top;
                handle.style.cursor = 'grabbing';
                container.style.transition = 'none';
                container.classList.add('dragging');
            };
            const onMouseMove = (e) => {
                if (!state.isDragging) return;
                let x = e.clientX - state.offsetX;
                let y = e.clientY - state.offsetY;
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;
                x = Math.max(0, Math.min(x, maxX));
                y = Math.max(0, Math.min(y, maxY));
                container.style.left = x + 'px';
                container.style.top = y + 'px';
                container.style.transform = 'none';
                if (options.onMove) options.onMove(x, y);
            };
            const onMouseUp = () => {
                if (!state.isDragging) return;
                state.isDragging = false;
                handle.style.cursor = 'move';
                container.style.transition = options.transition || '';
                container.classList.remove('dragging');
                if (options.onEnd) options.onEnd();
            };
            handle.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            this.dragMap.set(container, { destroy() {
                handle.removeEventListener('mousedown', onMouseDown);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }});
            return this.dragMap.get(container);
        },
        saveState(key, state) {
            try { localStorage.setItem(key, JSON.stringify(state)); } catch(e) {}
        },
        loadState(key, defaults) {
            try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : defaults; } catch(e) { return defaults; }
        }
    };

    function fetch(url, option = {}) {
        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.onreadystatechange = ()=> {
                if (req.readyState === 4) {
                    resolve({
                        ok: req.status>=200&&req.status<=299,
                        status: req.status,
                        statusText: req.statusText,
                        body: req.response,
                        json: ()=>Promise.resolve(JSON.parse(req.responseText)),
                        text: ()=>Promise.resolve(req.responseText)
                    });
                }
            };
            if (option.credentials == 'include') req.withCredentials = true;
            req.onerror = reject;
            req.open('GET', url);
            req.send();
        });
    }

    //编码器，用于将B站BCC字幕编码为常见字幕格式下载
    const encoder = {
        assHead : [
            '[Script Info]',
            `Title: ${document.title}`,
            'ScriptType: v4.00+',
            'Collisions: Reverse',
            'PlayResX: 1280',
            'PlayResY: 720',
            'WrapStyle: 3',
            'ScaledBorderAndShadow: yes',
            '; ----------------------',
            '; 本字幕由CC字幕助手自动转换',
            `; 字幕来源${document.location}`,
            '; 脚本地址https://greasyfork.org/scripts/378513',
            '; 设置了字幕过长自动换行，但若字幕中没有空格换行将无效',
            '; 字体大小依据720p 48号字体等比缩放',
            '; 如显示不正常请尝试使用SRT格式',
            '','[V4+ Styles]',
            'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, '
            +'BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, '
            +'BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
            'Style: Default,Segoe UI,48,&H00FFFFFF,&HF0000000,&H00000000,&HF0000000,1,0,0,0,100,100,0,0.00,1,1,3,2,30,30,20,1',
            '','[Events]',
            'Format: Layer, Start, End, Style, Actor, MarginL, MarginR, MarginV, Effect, Text'
        ],

        // ==================== 新增：拖动相关变量 ====================
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,
         dialogElement: null,
         panelElement: null,
         currentLan: null,
         languageSelect: null,
         languageStatus: null,
         formatSelect: null,
         resizeContainer: null,

        // ==================== 修改：移除遮罩层，直接创建可拖动对话框 ====================
         showDialog(data, download, lan){
            if(!data||!(data.body instanceof Array)){
                throw '数据错误';
             }
            this.data = data;
            this.currentLan = lan || null;
            const settingDiv = elements.createAs('div',{
                style :'position: fixed;top: 0;bottom: 0;left: 0;right: 0;background: transparent;pointer-events:none;z-index: 1048576;'+(download?'display:none':'')
            },document.body),
                  panel = this.panelElement = elements.createAs('div',{
                      id:'subtitle-download-panel',
                      style:'left:50%;top:50%;position:absolute;padding:15px;min-width:340px;max-width:calc(100vw - 20px);box-sizing:border-box;background:white;border-radius:8px;margin:auto;transform:translate(-50%,-50%);pointer-events:auto;box-shadow:0 4px 18px rgba(0,0,0,.18);'
                  },settingDiv),
                  header = elements.createAs('div',{
                      style:"position:relative;min-height:36px;margin-bottom:5px;cursor:move;user-select:none;line-height:1;",
                  },panel);
            elements.createAs('span',{
                innerText:'字幕批量下载复制查看器',
                style:'display:block;max-width:240px;white-space:nowrap;font-size:20px;line-height:24px;color:#00a1d6;font-weight:500;'
            },header);
            this.dialogElement = settingDiv;
            elements.createAs('a',{
                href:'https://greasyfork.org/scripts/378513',target:'_blank',
                style:'position:absolute;right:0;top:0;color:#606060;font-size:13px;white-space:nowrap;',
                innerHTML:`当前版本：${typeof(GM_info)!="undefined"&&GM_info.script.version||'1.0'}`
            },header);
            elements.createAs('span',{
                style:'position:absolute;right:0;top:19px;color:#99a2aa;font-size:12px;white-space:nowrap;',
                innerText:'窗口可拖动，点击⌜⌟可调整窗口大小'
            },header);
            const resizeContainer = this.resizeContainer = elements.createAs('div',{
                className:'subtitle-textarea-resize-box',
                style:'position:relative;width:500px;min-width:310px;height:410px;min-height:180px;max-width:calc(100vw - 40px);max-height:calc(100vh - 170px);'
            },panel),
                  textArea = this.textArea = elements.createAs('textarea',{
                      style:'width:100%;height:100%;box-sizing:border-box;resize:none;padding:5px;line-height:normal;border:1px solid #e5e9ef;margin:0px;'
                  },resizeContainer),
                  resizeHandle = elements.createAs('div',{
                      className:'subtitle-resize-handle',
                      style:'position:absolute;right:3px;bottom:3px;width:32px;height:32px;border:2px solid #fff;border-radius:5px;background:#00a1d6;box-shadow:0 1px 5px rgba(0,0,0,.35);color:#fff;cursor:nwse-resize;display:flex;align-items:center;justify-content:center;z-index:2;user-select:none;',
                innerHTML:'<svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M7 2H2v5M13 18h5v-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                      title:'点击或拖动此处调整字幕框大小',
                      onmousedown:(e)=>e.stopPropagation()
                  },resizeContainer);
             textArea.setAttribute('readonly',true);
             this.initTextAreaResize(resizeHandle, resizeContainer, panel);

             const availableLanguages = this.currentLan && typeof bilibiliCCHelper !== 'undefined'
                 ? (bilibiliCCHelper.subtitle?.subtitles || []).filter(item=>item.lan !== 'close' && item.lan !== 'local')
                 : [];
             if (availableLanguages.length) {
                 const languagePanel = elements.createAs('div',{style:'font-size:14px; padding-top: 10px;'},panel);
                 elements.createAs('span',{innerText:'语言：',style:'margin-right:5px;'},languagePanel);
                 this.languageSelect = elements.createAs('select',{
                     style:'height: 24px; margin-right: 5px; min-width: 120px;',
                     innerHTML:availableLanguages.map(item=>`<option value="${item.lan}">${item.lan_doc || item.lan}</option>`).join(''),
                     value:this.currentLan,
                     onchange:(ev)=>this.changeLanguage(ev.target.value)
                 },languagePanel);
                 this.refreshButton = elements.createAs('a',{
                     innerText:'刷新',
                     style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;cursor: pointer;',
                     onclick:(e)=>{e.preventDefault();e.stopPropagation();this.refreshCurrentSubtitle();}
                 },languagePanel);
                 this.languageStatus = elements.createAs('span',{style:'color:#99a2aa;font-size:12px;'},languagePanel);
             } else {
                 this.languageSelect = null;
                 this.languageStatus = null;
             }
            const bottomPanel = elements.createAs('div',{style:'font-size:14px; padding-top: 10px;'},panel);
            const type = localStorage.defaultSubtitleType || 'SRT';
             this.formatSelect = elements.createAs('select',{
                style:'height: 24px; margin-right: 5px;',
                innerHTML:['ASS','SRT','LRC','VTT','TXT','BCC'].map(type=>`<option value="${type}">${type}</option>`).join(''),
                value:type,
                onchange:(ev)=>this.updateDownload(ev.target.value)
            },bottomPanel);
            this.actionButton = elements.createAs('a',{
                title:'按住Ctrl键点击字幕列表的下载可不打开预览直接下载当前格式',
                innerText:'下载',style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;',
                onclick:(e)=>e.stopPropagation(),oncontextmenu:(e)=>e.stopPropagation()
            },bottomPanel);
            this.batchButton = elements.createAs('a',{
                innerText:'批量下载',
                style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;cursor: pointer;',
                href:'javascript:',
                onclick:(e)=>{e.preventDefault();e.stopPropagation();bilibiliCCHelper.openBatchDialog();},
                oncontextmenu:(e)=>e.stopPropagation()
            },bottomPanel);
            this.copyButton = elements.createAs('a',{
                innerText:'复制',
                style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;cursor: pointer;',
                href:'javascript:',
                onclick:(e)=>{e.preventDefault();e.stopPropagation();this.copyToClipboard();},
                oncontextmenu:(e)=>e.stopPropagation()
            },bottomPanel);
            this.openTabButton = elements.createAs('a',{
                innerText:'在新标签页中打开',style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;',
                target:'_blank',onclick:(e)=>e.stopPropagation(),oncontextmenu:(e)=>e.stopPropagation()
            },bottomPanel);
            this.closeButton = elements.createAs('a',{
                innerText:'关闭',style:'height: 24px;margin-right: 5px;background: #00a1d6;color: #fff;padding: 7px;cursor: pointer;',
                onclick:()=>document.body.removeChild(settingDiv)
            },bottomPanel);
            this.initDragging(header,panel);

             // 默认转换SRT格式
             this.updateDownload(type, download);
         },

         changeLanguage(lan){
             if(!lan || typeof bilibiliCCHelper === 'undefined') return;
             this.currentLan = lan;
             if(this.languageStatus) this.languageStatus.innerText = '加载中…';
             bilibiliCCHelper.getSubtitle(lan).then(data=>{
                 this.data = data;
                 this.updateDownload(this.formatSelect ? this.formatSelect.value : 'SRT');
                 if(this.languageStatus) this.languageStatus.innerText = '已切换';
             }).catch(e=>{
                 if(this.languageStatus) this.languageStatus.innerText = '加载失败';
                 bilibiliCCHelper.toast('切换字幕失败',e);
             });
         },

         refreshCurrentSubtitle(){
             if(!this.currentLan || typeof bilibiliCCHelper === 'undefined') return;
             if(this.languageStatus) this.languageStatus.innerText = '刷新中…';
             bilibiliCCHelper.setupData(true).then(()=>{
                 bilibiliCCHelper.datas = {close:{body:[]},local:{body:[]}};
                 return bilibiliCCHelper.getSubtitle(this.currentLan);
             }).then(data=>{
                 this.data = data;
                 this.updateDownload(this.formatSelect ? this.formatSelect.value : 'SRT');
                 if(this.languageStatus) this.languageStatus.innerText = '已刷新';
         }).catch(e=>{
                 if(this.languageStatus) this.languageStatus.innerText = '刷新失败';
                 bilibiliCCHelper.toast('刷新字幕失败',e);
             });
         },

         // 让右下角的蓝色手柄直接调整字幕文本框大小
         initTextAreaResize(handle, container, panel){
             const minWidth = 310;
             const minHeight = 180;
             let resizing = false;
             let startX = 0;
             let startY = 0;
             let startWidth = 0;
             let startHeight = 0;

             const onMove = (e) => {
                 if(!resizing) return;
                 const maxWidth = Math.max(minWidth, window.innerWidth - 40);
                 const maxHeight = Math.max(minHeight, window.innerHeight - 170);
                 const width = Math.max(minWidth, Math.min(maxWidth, startWidth + e.clientX - startX));
                 const height = Math.max(minHeight, Math.min(maxHeight, startHeight + e.clientY - startY));
                 container.style.width = width + 'px';
                 container.style.height = height + 'px';
                 if(panel) panel.style.width = Math.max(340, width + 30) + 'px';
             };
             const onUp = () => {
                 if(!resizing) return;
                 resizing = false;
                 handle.classList.remove('active');
                 document.removeEventListener('mousemove', onMove);
                 document.removeEventListener('mouseup', onUp);
             };
             handle.addEventListener('mousedown', (e) => {
                 e.preventDefault();
                 e.stopPropagation();
                 const rect = container.getBoundingClientRect();
                 resizing = true;
                 startX = e.clientX;
                 startY = e.clientY;
                 startWidth = rect.width;
                 startHeight = rect.height;
                 handle.classList.add('active');
                 document.addEventListener('mousemove', onMove);
                 document.addEventListener('mouseup', onUp);
             });
         },

         // ==================== 修改：改进拖动功能 ====================
        initDragging(handle, container){
            const self = this;

            handle.addEventListener('mousedown', function(e){
                // 排除点击按钮的情况
                if(e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.innerHTML === '×') return;

                // 阻止事件冒泡，防止被其他元素拦截
                e.stopPropagation();

                self.isDragging = true;
                const rect = container.getBoundingClientRect();
                self.dragOffsetX = e.clientX - rect.left;
                self.dragOffsetY = e.clientY - rect.top;

                // 改变光标样式
                handle.style.cursor = 'grabbing';
                container.style.transition = 'none';

                e.preventDefault();
            });

            // 使用全局事件监听，确保拖动流畅
            const onMouseMove = function(e){
                if(!self.isDragging) return;

                const x = e.clientX - self.dragOffsetX;
                const y = e.clientY - self.dragOffsetY;

                // 限制在视窗内
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;

                const clampedX = Math.max(0, Math.min(x, maxX));
                const clampedY = Math.max(0, Math.min(y, maxY));

                container.style.left = clampedX + 'px';
                container.style.top = clampedY + 'px';
                container.style.transform = 'none';
            };

            const onMouseUp = function(){
                if(self.isDragging){
                    self.isDragging = false;
                    handle.style.cursor = 'move';
                    container.style.transition = 'transform 0.2s, left 0.2s, top 0.2s';
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            // 保存监听器引用以便清理（可选）
            this._dragMoveHandler = onMouseMove;
            this._dragUpHandler = onMouseUp;
        },

        // ==================== 新增：一键复制功能 ====================
        copyToClipboard(){
            const text = this.textArea.value;
            if(!text || text.length === 0){
                this.showToast('没有可复制的内容！', 'error');
                return;
            }

            try {
                // 使用GM_setClipboard（油猴API）或navigator.clipboard
                if(typeof GM_setClipboard !== 'undefined'){
                    GM_setClipboard(text, 'text');
                    this.showCopySuccess();
                } else if(navigator.clipboard && navigator.clipboard.writeText){
                    navigator.clipboard.writeText(text).then(()=>{
                        this.showCopySuccess();
                    }).catch(err=>{
                        this.fallbackCopy(text);
                    });
                } else {
                    this.fallbackCopy(text);
                }
            } catch(e) {
                this.fallbackCopy(text);
            }
        },

        // 备用复制方案
        fallbackCopy(text){
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                if(successful){
                    this.showCopySuccess();
                } else {
                    this.showToast('❌ 复制失败，请手动复制', 'error');
                }
            } catch(err) {
                this.showToast('❌ 复制失败，请手动复制', 'error');
            }

            document.body.removeChild(textArea);
        },

        showCopySuccess(){
            this.showToast('✅ 复制成功！已保存到剪贴板');
            if(this.copyButton){
                const button = this.copyButton;
                button.innerText = '已复制 ✓';
                button.style.background = '#20b26b';
                clearTimeout(this.copyResetTimer);
                this.copyResetTimer = setTimeout(()=>{
                    if(button.parentNode){
                        button.innerText = '复制';
                        button.style.background = '#00a1d6';
                    }
                }, 1800);
            }
        },

        // 显示提示
        showToast(message, type='success'){
            // 移除已存在的toast
            const existing = document.querySelector('.copy-success-toast');
            if(existing) existing.remove();

            const toast = elements.createAs('div',{
                className: 'copy-success-toast',
                innerText: message,
                style:`position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:1048579;background:${type==='error'?'#e85d5d':'#20b26b'};color:#fff;padding:12px 22px;border-radius:6px;font-size:14px;line-height:1.4;box-shadow:0 3px 12px rgba(0,0,0,.28);pointer-events:none;white-space:nowrap;animation:none;`
            },document.body);

            setTimeout(()=>{
                if(toast.parentNode) toast.parentNode.removeChild(toast);
            }, 2000);
        },

        updateDownload(type='LRC', download){
            let result;
            let blobResult
            switch(type) {
                case 'LRC':
                    result = this.encodeToLRC(this.data.body);
                    break;
                case 'SRT':
                    result = this.encodeToSRT(this.data.body);
                    break;
                case 'ASS':
                    result = this.encodeToASS(this.data.body);
                    break;
                case 'VTT':
                    result = this.encodeToVTT(this.data.body);
                    break;
                case 'TXT':
                    result = this.data.body.map(item=>item.content).join('\r\n');
                    break;
                case 'BCC':
                    result = JSON.stringify(this.data,undefined,2);
                    break;
                default:
                    result = '错误：无法识别的格式 ' + type;
                    break;
            }
            this.textArea.value = result;
            localStorage.defaultSubtitleType = type;
            type = type.toLowerCase();
            URL.revokeObjectURL(this.actionButton.href);
            this.actionButton.classList.remove('bpui-state-disabled','bui-button-disabled');
            blobResult = new Blob([result],{type:'text/'+type+';charset=utf-8'})
            this.actionButton.href = URL.createObjectURL(blobResult);
            this.openTabButton.href = URL.createObjectURL(blobResult);
            this.actionButton.download = `${bilibiliCCHelper.getInfo('h1Title') || document.title}.${type}`;
            if (download) {
                this.actionButton.click();
                this.closeButton.click();
            }
        },
        encodeToLRC(data){
            return data.map(({from,to,content})=>{
                return `${this.encodeTime(from,'LRC')} ${content.replace(/\n/g,' ')}`;
            }).join('\r\n');
        },
        encodeToSRT(data){
            return data.map(({from,to,content},index)=>{
                return `${index+1}\r\n${this.encodeTime(from)} --> ${this.encodeTime(to)}\r\n${content}`;
            }).join('\r\n\r\n');
        },
        encodeToVTT(data){
            return 'WEBVTT \r\n\r\n' + data.map(({from,to,content},index)=>{
                return `${index+1}\r\n${this.encodeTime(from, 'VTT')} --> ${this.encodeTime(to, 'VTT')}\r\n${content}`;
            }).join('\r\n\r\n');
        },
        encodeToASS(data){
            this.assHead[1] = `Title: ${document.title}`;
            this.assHead[10] = `; 字幕来源${document.location}`;
            return this.assHead.concat(data.map(({from,to,content})=>{
                return `Dialogue: 0,${this.encodeTime(from,'ASS')},${this.encodeTime(to,'ASS')},*Default,NTP,0000,0000,0000,,${content.replace(/\n/g,'\\N')}`;
            })).join('\r\n');
        },
        encodeTime(input,format='SRT'){
            let time = new Date(input*1000),
                ms = time.getMilliseconds(),
                second = time.getSeconds(),
                minute = time.getMinutes(),
                hour = Math.floor(input/60/60);
            if (format=='SRT'||format=='VTT'){
                if (hour<<10) hour = '0'+hour;
                if (minute<<10) minute = '0'+minute;
                if (second<<10) second = '0'+second;
                if (ms<<10) ms = '00'+ms;
                else if (ms<<100) ms = '0'+ms;
                return `${hour}:${minute}:${second}${format=='SRT'?',':'.'}${ms}`;
            }
            else if(format=='ASS'){
                ms = (ms/10).toFixed(0);
                if (minute<<10) minute = '0'+minute;
                if (second<<10) second = '0'+second;
                if (ms<<10) ms = '0'+ms;
                return `${hour}:${minute}:${second}.${ms}`;
            }
            else{
                ms = (ms/10).toFixed(0);
                minute += hour*60;
                if (minute<<10) minute = '0'+minute;
                if (second<<10) second = '0'+second;
                if (ms<<10) ms = '0'+ms;
                return `[${minute}:${second}.${ms}]`;
            }
        }
    };

    //解码器，用于读取常见格式字幕并将其转换为B站可以读取BCC格式字幕
    const decoder = {
        srtReg:/(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\s*(?:-->|,)\s*(?:(\d+):)?(\d{1,2}):(\d{1,2})[,\.](\d{1,3})\r?\n([.\s\S]+)/,
        assReg:/Dialogue:.*,(\d+):(\d{1,2}):(\d{1,2}\.?\d*),\s*?(\d+):(\d{1,2}):(\d{1,2}\.?\d*)(?:.*?,){7}(.+)/,
        encodings:['UTF-8','GB18030','BIG5','UNICODE','JIS','EUC-KR'],
        encoding:'UTF-8',
        dialog:undefined,
        reader:undefined,
        file:undefined,
        data:undefined,
        statusHandler:undefined,

        // ==================== 新增：拖动相关变量 ====================
        isDragging: false,
        dragOffsetX: 0,
        dragOffsetY: 0,

        show(handler){
            this.statusHandler = handler;
            if(!this.dialog){
                this.moveAction = ev=>this.dialogMove(ev);
                this.dialog = elements.createAs('div',{
                    id :'subtitle-local-selector',
                    style :'position:fixed;z-index:1048576;padding:10px;top:50%;left:calc(50% - 185px);box-shadow: 0 0 4px #e5e9ef;border: 1px solid #e5e9ef;background:white;border-radius:5px;color:#99a2aa'
                },elements.getAs('#bilibiliPlayer'));
                // 标题栏，保留拖动功能
                const header = elements.createAs('div',{
                    style:"margin-bottom: 5px;cursor:move;user-select:none;line-height:1;",
                    innerText:'本地字幕选择'
                },this.dialog);
                elements.createAs('input',{
                    style: "margin-bottom: 5px;width: 370px;",
                    innerText:'选择字幕',
                    type: 'file',accept:'.lrc,.ass,.ssa,.srt,.bcc,.sbv,.vtt',
                    oninput:  ({target})=> this.readFile(this.file = target.files&&target.files[0])
                },this.dialog);
                elements.createAs('br',{},this.dialog);
                elements.createAs('label',{style: "margin-right: 10px;",innerText: '字幕编码'},this.dialog);
                elements.createAs('select',{
                    style: "width: 80px;height: 20px;border-radius: 4px;line-height: 20px;border:1px solid #ccd0d7;",
                    title:'如果字幕乱码可尝试更改编码',
                    innerHTML:this.encodings.reduce((result,item)=>`${result}<option value="${item}">${item}</option>`,''),
                    oninput:  ({target})=> this.readFile(this.encoding = target.value)
                },this.dialog);
                elements.createAs('label',{
                    style: "margin-left: 10px;",innerText: '时间偏移(s)',title:'字幕相对于视频的时间偏移，双击此标签复位时间偏移',
                    ondblclick:()=> +this.offset.value&&this.handleSubtitle(this.offset.value=0)
                },this.dialog);
                this.offset = elements.createAs('input',{
                    style: "margin-left: 10px;width: 50px;border: 1px solid #ccd0d7;border-radius: 4px;line-height: 20px;",
                    type:'number', step:0.5, value:0,
                    title:'负值表示将字幕延后，正值将字幕提前',
                    oninput:  ()=> this.handleSubtitle()
                },this.dialog);
                elements.createAs('button',{
                    style: "margin-left: 10px;border:none;width:max-content;",innerText: '关闭面板',
                    className:'bpui-button bui bui-button bui-button-blue',
                    onclick:  ()=> elements.getAs('#bilibiliPlayer').removeChild(this.dialog)
                },this.dialog);
                this.reader = new FileReader();
                this.reader.onloadend = ()=> this.decodeFile()
                this.reader.onerror = e=> bilibiliCCHelper.toast('载入字幕失败',e);
                this.initDragging(header, this.dialog);
            }
            else{
                elements.getAs('#bilibiliPlayer').appendChild(this.dialog);
                this.handleSubtitle();
            }
        },

        // ==================== 修改：改进本地字幕对话框拖动 ====================
        initDragging(handle, container){
            const self = this;

            handle.addEventListener('mousedown', function(e){
                if(e.target.innerHTML === '×') return; // 排除关闭按钮

                // 阻止事件冒泡
                e.stopPropagation();

                self.isDragging = true;
                const rect = container.getBoundingClientRect();
                self.dragOffsetX = e.clientX - rect.left;
                self.dragOffsetY = e.clientY - rect.top;
                handle.style.cursor = 'grabbing';
                container.style.transition = 'none';
                e.preventDefault();
            });

            const onMouseMove = function(e){
                if(!self.isDragging) return;
                const x = e.clientX - self.dragOffsetX;
                const y = e.clientY - self.dragOffsetY;
                // 限制在视窗内
                const maxX = window.innerWidth - container.offsetWidth;
                const maxY = window.innerHeight - container.offsetHeight;
                container.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
                container.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
                container.style.transform = 'none';
            };

            const onMouseUp = function(){
                if(self.isDragging){
                    self.isDragging = false;
                    handle.style.cursor = 'move';
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        },

        dialogMove(ev){
            // 已废弃，改用新的拖动系统
        },
        readFile(){
            if(!this.file) {
                this.data = undefined;
                return bilibiliCCHelper.toast('没有文件');
            }
            this.reader.readAsText(this.file,this.encoding)
        },
        handleSubtitle(){
            if(!this.data) return;
            const offset = +this.offset.value;
            bilibiliCCHelper.updateLocal(!offset?this.data:{
                body:this.data.body.map(({from,to,content})=>({
                    from:from - offset,
                    to:to - offset,
                    content
                }))
            }).then(()=>{
                if('function'==typeof(this.statusHandler)) this.statusHandler(true);
                bilibiliCCHelper.toast(`载入本地字幕:${this.file.name},共${this.data.body.length}行,偏移:${offset}s`);
            }).catch(e=>{
                bilibiliCCHelper.toast('载入字幕失败',e);
            });
        },
        decodeFile(){
            try{
                const type = this.file.name.split('.').pop().toLowerCase();
                switch(type){
                    case 'lrc':this.data = this.decodeFromLRC(this.reader.result);break;
                    case 'ass':case 'ssa': this.data = this.decodeFromASS(this.reader.result);break;
                    case 'srt':case 'sbv':case 'vtt': this.data = this.decodeFromSRT(this.reader.result);break;
                    case 'bcc':this.data = JSON.parse(this.reader.result);break;
                    default:throw('未知文件类型'+type);break;
                }
                console.log(this.data);
                this.handleSubtitle();
            }
            catch(e){
                bilibiliCCHelper.toast('解码字幕文件失败',e);
            };
        },
        decodeFromLRC(input){
            if(!input) return;
            const data = [];
            input.split('\n').forEach(line=>{
                let match = line.match(/((\[\d+:\d+\.?\d*\])+)(.*)/);
                if (!match) {
                    if(match=line.match(/\[offset:(\d+)\]/i)) {
                        this.offset.value = +match[1]/1000;
                    }
                    return;
                }
                const times = match[1].match(/\d+:\d+\.?\d*/g);
                times.forEach(time=>{
                    const t = time.split(':');
                    data.push({
                        time:t[0]*60 + (+t[1]),
                        content:match[3].trim().replace('\r','')
                    });
                });
            });
            return {
                body:data.sort((a,b)=>a.time-b.time).map((item,index)=>(
                    item.content!=''&&{
                        from:item.time,
                        to:index==data.length-1?item.time+20:data[index+1].time,
                        content:item.content
                    }
                )).filter(item=>item)
            };
        },
        decodeFromSRT(input){
            if(!input) return;
            const data = [];
            let split = input.split('\n\n');
            if(split.length==1) split = input.split('\r\n\r\n');
            split.forEach(item=>{
                const match = item.match(this.srtReg);
                if (!match){
                    return;
                }
                data.push({
                    from:(match[1]*60*60||0) + match[2]*60 + (+match[3]) + (match[4]/1000),
                    to:(match[5]*60*60||0) + match[6]*60 + (+match[7]) + (match[8]/1000),
                    content:match[9].trim().replace(/{\\.+?}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')
                });
            });
            return {body:data.sort((a,b)=>a.from-b.from)};
        },
        decodeFromASS(input){
            if(!input) return;
            const data = [];
            let split = input.split('\n');
            split.forEach(line=>{
                const match = line.match(this.assReg);
                if (!match){
                    return;
                }
                data.push({
                    from:match[1]*60*60 + match[2]*60 + (+match[3]),
                    to:match[4]*60*60 + match[5]*60 + (+match[6]),
                    content:match[7].trim().replace(/{\\.+?}/g,'').replace(/\\N/gi,'\n').replace(/\\h/g,' ')
                });
            });
            return {body:data.sort((a,b)=>a.from-b.from)};
        }
    };

    //旧版播放器CC字幕助手...
    const oldPlayerHelper = {
        setting:undefined,
        subtitle:undefined,
        selectedLan:undefined,
        isclosed:true,
        resizeRate: 100,
        configs:{
            color:[
                {value:'16777215',content:'<<span style="color:#FFF;text-shadow: #000 0px 0px 1px">白色</span>'},
                {value:'16007990',content:'<<b style="color:#F44336;text-shadow: #000 0px 0px 1px">红色</b>'},
                {value:'10233776',content:'<<b style="color:#9C27B0;text-shadow: #000 0px 0px 1px">紫色</b>'},
                {value:'6765239',content:'<<b style="color:#673AB7;text-shadow: #000 0px 0px 1px">深紫色</b>'},
                {value:'4149685',content:'<<b style="color:#3F51B5;text-shadow: #000 0px 0px 1px">靛青色</b>'},
                {value:'2201331',content:'<<b style="color:#2196F3;text-shadow: #000 0px 0px 1px">蓝色</b>'},
                {value:'240116',content:'<<b style="color:#03A9F4;text-shadow: #000 0px 0px 1px">亮蓝色</b>'}
            ],
            position:[
                {value:'bl',content:'左下角'},
                {value:'bc',content:'底部居中'},
                {value:'br',content:'右下角'},
                {value:'tl',content:'左上角'},
                {value:'tc',content:'顶部居中'},
                {value:'tr',content:'右上角'}
            ],
            shadow:[
                {value:'0',content:'无描边',style:''},
                {value:'1',content:'重墨',style:`text-shadow: #000 1px 0px 1px, #000 0px 1px 1px, #000 0px -1px 1px,#000 -1px 0px 1px;`},
                {value:'2',content:'描边',style:`text-shadow: #000 0px 0px 1px, #000 0px 0px 1px, #000 0px 0px 1px;`},
                {value:'3',content:'45°投影',style:`text-shadow: #000 1px 1px 2px, #000 0px 0px 1px;`}
            ]
        },
        saveSetting(){
            try{
                const playerSetting = localStorage.bilibili_player_settings?JSON.parse(localStorage.bilibili_player_settings):{};
                playerSetting.subtitle = this.setting;
                localStorage.bilibili_player_settings = JSON.stringify(playerSetting);
            }catch(e){
                bilibiliCCHelper.toast('保存字幕设置错误',e);
            }
        },
        changeStyle(){
            this.fontStyle.innerHTML = `span.subtitle-item-background{opacity: ${this.setting.backgroundopacity};}`
                + `span.subtitle-item-text {color:#${("000000"+this.setting.color.toString(16)).slice(-6)};}`
                + `span.subtitle-item {font-size: ${this.setting.fontsize*this.resizeRate}%;line-height: 110%;}`
                + `span.subtitle-item {${this.configs.shadow[this.setting.shadow].style}}`;
        },
        changePosition(){
            this.subtitleContainer.className = 'subtitle-position subtitle-position-'
                 +(this.setting.position||'bc');
            this.subtitleContainer.style = '';
        },
        changeResize(){
            this.resizeRate = this.setting.scale?bilibiliCCHelper.window.player.getWidth()/1280*100:100;
            this.changeStyle();
        },
        changeSubtitle(value=this.subtitle.subtitles[0].lan){
            this.selectedLanguage.innerText = bilibiliCCHelper.getSubtitleInfo(value).lan_doc;
            if(value=='close'){
                if(!this.isclosed) {
                    this.isclosed = true;
                    bilibiliCCHelper.loadSubtitle(value);
                    if(this.selectedLan!='local') this.setting.isclosed = true;
                }
                this.downloadBtn.classList.add('bpui-state-disabled','bpui-button-icon');
                this.icon.innerHTML = elements.oldDisableIcon;
            }
            else if(value=='local') {
                decoder.show((status)=>{
                    if(status==true){
                        this.downloadBtn.classList.remove('bpui-state-disabled','bpui-button-icon');
                        this.isclosed = false;
                        this.selectedLan = value;
                        this.icon.innerHTML = elements.oldEnableIcon;
                    }
                });
            }
            else{
                this.isclosed = false;
                this.selectedLan = value;
                this.icon.innerHTML = elements.oldEnableIcon;
                this.setting.lan = value;
                this.setting.isclosed = false;
                bilibiliCCHelper.loadSubtitle(value);
                this.downloadBtn.classList.remove('bpui-state-disabled','bpui-button-icon');
            }
        },
        toggleSubtitle(){
            if(this.isclosed) {
                this.changeSubtitle(this.selectedLan);
            }
            else{
                this.changeSubtitle('close');
            }
        },
        initSubtitle(){
            if(this.setting.isclosed) {
                this.changeSubtitle('close');
            }
            else{
                const lan = bilibiliCCHelper.getSubtitleInfo(this.setting.lan)&&this.setting.lan
                this.changeSubtitle(lan);
            }
            if(!this.subtitle.count) this.selectedLan = 'local';
            this.changeResize();
        },
        initUI(){
            const preBtn = elements.getAs('.bilibili-player-video-btn-quality');
            if(!preBtn) throw('没有找到视频清晰度按钮');
            this.subtitleContainer = elements.getAs('.bilibili-player-video-subtitle>div');
            const btn = preBtn.insertAdjacentElement('afterEnd',elements.createAs('div',{
                className:"bilibili-player-video-btn",
                id:'bilibili-player-subtitle-btn',
                style:"display: block;",
                innerHTML:elements.subtitleStyle,
                onclick:(e)=>{
                    if(!this.panel.contains(e.target)) this.toggleSubtitle();
                }
            }));
            this.icon = elements.createAs('span',{
                innerHTML: this.setting.isclosed?elements.oldDisableIcon:elements.oldEnableIcon
            },btn);
            this.fontStyle = elements.createAs('style',{type:"text/css"},btn);
            const panel = this.panel = elements.createAs('div',{
                id:'subtitle-setting-panel',
                style:'position: absolute;bottom: 28px;right: 30px;background: white;border-radius: 4px;text-align: left;padding: 13px;display: none;cursor:default;'
            },btn),
                  languageDiv = elements.createAs('div',{innerHTML:'<<div>字幕</div>'},panel),
                  sizeDiv = elements.createAs('div',{innerHTML:'<<div>字体大小</div>'},panel),
                  colorDiv = elements.createAs('div',{innerHTML:'<<span>字幕颜色</span>'},panel),
                  shadowDiv = elements.createAs('div',{innerHTML:'<<span>字幕描边</span>'},panel),
                  positionDiv = elements.createAs('div',{innerHTML:'<<span>字幕位置</span>'},panel),
                  opacityDiv = elements.createAs('div',{innerHTML:'<<div>背景不透明度</div>'},panel);
            this.selectedLanguage = elements.createSelector({
                width:'100px',height:'180px',initValue:'close',
                handler:(value)=>this.changeSubtitle(value),
                datas:this.subtitle.subtitles.map(({lan,lan_doc})=>({content:lan_doc,value:lan}))
            },languageDiv);
            this.downloadBtn = elements.createAs('button',{
                className: "bpui-button",style: 'padding:0 8px;',
                innerText: "下载",
                onclick: (ev)=>{
                    if(this.selectedLan=='close') return;
                    bilibiliCCHelper.downloadSubtitle(this.selectedLan, undefined, ev.ctrlKey);
                }
            },languageDiv);
            elements.createAs('a',{
                className: this.subtitle.allow_submit?'bpui-button':'bpui-button bpui-state-disabled',
                innerText: '添加字幕',
                href: !this.subtitle.allow_submit?'javascript:':`https://member.bilibili.com/v2#/zimu/my-zimu/zimu-editor?cid=${window.cid}&${window.aid?`aid=${window.aid}`:`bvid=${window.bvid}`}`,
                target: '_blank',
                style: 'margin-right: 0px;height: 24px;padding:0 6px;',
                title: this.subtitle.allow_submit?'':'本视频无法添加字幕',
            },languageDiv);
            elements.createAs('input',{
                style:"width: 70%;",type:"range",step:"25",
                value: (this.setting.fontsize==0.6?0:this.setting.fontsize==0.8?25:this.setting.fontsize==1.3?75:this.setting.fontsize==1.6?100:50),
                oninput:(e)=>{
                    const v = e.target.value/25;
                    this.setting.fontsize = v>2?(v-2)*0.3+1:v*0.2+0.6;
                    this.changeStyle();
                }
            },sizeDiv);
            elements.createAs('input',{
                id:'subtitle-auto-resize',
                type:"checkbox",
                checked:this.setting.scale,
                onchange:(e)=>this.changeResize(this.setting.scale = e.target.checked)
            },sizeDiv);
            elements.createAs('label',{
                style:"cursor:pointer",
                innerText:'自动缩放'
            },sizeDiv).setAttribute('for','subtitle-auto-resize');
            elements.createSelector({
                width:'74%',height:'120px',
                initValue:this.setting.color,
                handler:(value)=>this.changeStyle(this.setting.color=parseInt(value)),
                datas:this.configs.color
            },colorDiv);
            elements.createSelector({
                width:'74%',height:'120px',
                initValue:this.setting.shadow,
                handler:(value)=>this.changeStyle(this.setting.shadow=value),
                datas:this.configs.shadow
            },shadowDiv);
            elements.createSelector({
                width:'74%',initValue:this.setting.position,
                handler:(value)=>this.changePosition(this.setting.position=value),
                datas:this.configs.position
            },positionDiv);
            elements.createAs('input',{
                style:"width: 100%;",
                type:"range",
                value: this.setting.backgroundopacity*100,
                oninput:(e)=>{
                    this.changeStyle(this.setting.backgroundopacity = e.target.value/100);
                }
            },opacityDiv);
            bilibiliCCHelper.window.player.addEventListener('video_resize', (event) => {
                this.changeResize(event);
            });
            bilibiliCCHelper.window.addEventListener("beforeunload", (event) => {
                this.saveSetting();
            });
            this.initSubtitle();
            console.log('init cc helper button done');
        },
        init(subtitle){
            this.subtitle = subtitle;
            this.selectedLan = undefined;
            try {
                if (!localStorage.bilibili_player_settings) throw '当前播放器没有设置信息';
                this.setting = JSON.parse(localStorage.bilibili_player_settings).subtitle;
                if (!this.setting) throw '当前播放器没有字幕设置';
            }catch (e) {
                bilibiliCCHelper.toast('bilibili CC字幕助手读取设置出错,将使用默认设置:', e);
                this.setting = {backgroundopacity: 0.5,color: 16777215,fontsize: 1,isclosed: false,scale: true,shadow: "0", position: 'bc'};
            }
            this.initUI();
        }
    };

    //2.x播放器CC字幕助手...
    const player2x = {
        iconBtn:undefined,
        icon:undefined,
        panel:undefined,
        downloadBtn:undefined,
        selectedLan:undefined,
        selectedLocal:false,
        hasSubtitles:false,
        updateDownloadBtn(value='close'){
            this.selectedLan = value;
            if(value=='close'){
                this.downloadBtn.classList.add('bui-button-disabled','bpui-button-icon');
            }
            else{
                this.selectedLocal = false;
                this.downloadBtn.classList.remove('bui-button-disabled','bpui-button-icon');
            }
        },
        initUI(){
            const downloadBtn = this.downloadBtn = this.panel.nextElementSibling.cloneNode(),
                  selector = this.panel.querySelector('ul'),
                  selectedItem = selector.querySelector('li.bui-select-item.bui-select-item-active'),
                  closeItem = selector.querySelector('li.bui-select-item[data-value="close"]'),
                  localItem = closeItem.cloneNode();
            elements.setAs(downloadBtn,{
                style: 'min-width:unset!important',innerText: '下载',
                onclick: (ev)=>{
                    if(this.selectedLan=='close') return;
                    bilibiliCCHelper.downloadSubtitle(this.selectedLan, undefined, ev.ctrlKey);
                }
            });
            this.panel.insertAdjacentElement('afterend',downloadBtn);
            this.updateDownloadBtn(selectedItem&&selectedItem.dataset.value);
            elements.setAs(localItem,{
                innerText: '本地字幕',
                onclick: ()=> {
                    decoder.show((status)=>{
                        if(status==true){
                            this.selectedLocal = true;
                            this.updateDownloadBtn('local');
                            this.icon.innerHTML = elements.newEnableIcon;
                        }
                    });
                }
            },selector);
            closeItem.addEventListener('click',()=>{
                if(!this.selectedLocal) return;
                this.selectedLocal = false;
                bilibiliCCHelper.loadSubtitle('close');
                this.icon.innerHTML = elements.newDisableIcon;
            });
            if(!this.hasSubtitles && this.icon){
                this.icon.innerHTML = elements.newDisableIcon;
                this.icon.addEventListener('click',({target})=>{
                    if(!this.selectedLocal) localItem.click();
                    else closeItem.click();
                });
            }
            new MutationObserver((mutations,observer)=>{
                mutations.forEach(mutation=>{
                    if(!mutation.target||mutation.type!='attributes') return;
                    if(mutation.target.classList.contains('bui-select-item-active')&&mutation.target.dataset.value){
                        this.updateDownloadBtn(mutation.target.dataset.value);
                    }
                });
            }).observe(selector,{
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
            console.log('Bilibili CC Helper init new UI success.');
        },
        initUI275(){
            if (this.localPanel = this.panel.querySelector('.bilibili-player-video-subtitle-setting-item-body')) {
                if (!(this.localButton = this.localPanel.querySelector('.bilibili-player-video-subtitle-setting-title'))) {
                    this.localPanel.insertAdjacentElement('afterbegin', elements.createAs('div', {
                        innerText: '字幕',
                        className: 'bilibili-player-video-subtitle-setting-title',
                        onclick:()=> decoder.show(status=>(status && (this.icon.innerHTML = elements.newEnableIcon)))
                    }));
                }
                else {
                    this.localButton.onclick = ()=> decoder.show(status=>{
                        if (status) {
                            this.selectedLocal = true;
                            this.icon.innerHTML = elements.newEnableIcon;
                        }
                    })
                }
            }
            if (this.lngPanel = this.panel.querySelector('.bilibili-player-video-subtitle-setting-lan-majorlist')) {
                this.lngPanel.addEventListener('click', function(ev) {
                    if (!(ev.target instanceof HTMLLIElement) || ev.target.lastChild.data=='本地字幕') return;
                    const rect = ev.target.getBoundingClientRect().right;
                    if (rect ==0 || rect -ev.x > 30) return;
                    bilibiliCCHelper.downloadSubtitle(undefined, ev.target.lastChild.data, ev.ctrlKey);
                    return false;
                });
            }
            elements.createAs('style', {
                innerHTML:'.bilibili-player-video-subtitle-setting-lan-majorlist>li.bilibili-player-video-subtitle-setting-lan-majorlist-item:after {content: "下载";right: 12px;position: absolute;}'
                +'.bilibili-player-video-subtitle-setting-title {cursor:pointer}.bilibili-player-video-subtitle-setting-title:before {content: "本地"}'
            }, this.panel);
            if(!this.hasSubtitles) {
                this.icon.onclick = ()=>{
                    if (this.selectedLocal) {
                        this.selectedLocal = false;
                        bilibiliCCHelper.loadSubtitle('close');
                        this.icon.innerHTML = elements.newDisableIcon;
                    }
                    else {
                        this.localButton.click();
                    }
                };
                this.icon.innerHTML = elements.newDisableIcon;
            }
            console.log('Bilibili CC Helper init new 2.75 UI success.');
        },
        init(subtitle){
            this.hasSubtitles = subtitle.count;
            this.selectedLan = undefined;
            this.selectedLocal = false;
            this.iconBtn = elements.getAs('.bilibili-player-video-btn-subtitle');
            this.panel = elements.getAs('.bilibili-player-video-subtitle-setting-lan');
            this.icon = this.iconBtn.querySelector('.bilibili-player-iconfont-subtitle span');
            elements.createAs('style', {innerHTML:'.bilibili-player-video-subtitle {z-index: 20;}'}, document.head);
            if(this.panel){
                this.initUI();
                this.iconBtn.id = 'bilibili-player-subtitle-btn';
            }
            else if(this.iconBtn){
                this.iconBtn.style = 'display:block';
                if(!this.hasSubtitles&&this.icon) this.icon.innerHTML = elements.newDisableIcon;
                this.iconBtn.id = 'bilibili-player-subtitle-btn';
                new MutationObserver((mutations,observer)=>{
                    for (const mutation of mutations){
                        if(!mutation.target) continue;
                        if (mutation.target.classList.contains('bilibili-player-video-subtitle-setting-left')){
                            observer.disconnect();
                            if (this.panel = mutation.target.querySelector('.bilibili-player-video-subtitle-setting-lan')) {
                                this.initUI();
                            }
                            else {
                                this.panel = mutation.target;
                                this.initUI275();
                            }
                            return;
                        }
                    }
                }).observe(this.iconBtn,{
                    childList: true,
                    subtree: true
                });
            }
            else{
                throw('找不到新播放器按钮');
            }
        },
    };

    // 3.15新版播放器...
    const player315 = {
        panel:undefined,
        initUI(){
            elements.createAs('style',{
                innerHTML:'.bpx-player-ctrl-subtitle-major-inner>.bpx-player-ctrl-subtitle-language-item:after {content: "下载";position:absolute;right:12px; margin-top:12px;}'
            }, this.panel);
            this.panel.addEventListener('click', function(ev) {
                if ((!ev.target || !ev.target.classList.contains('bpx-player-ctrl-subtitle-language-item'))) return;
                const rect = ev.target.getBoundingClientRect().right;
                if (rect ==0 || rect -ev.x > 30) return;
                ev.preventDefault();
                ev.stopPropagation();
                bilibiliCCHelper.downloadSubtitle(ev.target.dataset.lan, ev.target.lastChild.data, ev.ctrlKey);
                return false;
            }, true);
            this.panel.id = 'bilibili-player-subtitle-btn';
            console.log('3.15 Bilibili CC Helper init new Bangumi UI success.');
        },
        init(subtitle){
            this.panel = elements.getAs('.bpx-player-ctrl-subtitle-major-content');
            if (!this.panel) {
                throw('无字幕');
            }
            this.initUI();
        },
    };

    //3.14版番剧播放器...
    const player314 = {
        iconBtn:undefined,
        icon:undefined,
        panel:undefined,
        selectedLan:undefined,
        selectedLocal:false,
        hasSubtitles:false,
        updateBtnIcon(value) {
            if (value) {
                this.icon.classList.add('squirtle-subtitle-show-state');
                this.icon.classList.remove('squirtle-subtitle-hide-state');
            } else {
                this.icon.classList.add('squirtle-subtitle-hide-state');
                this.icon.classList.remove('squirtle-subtitle-show-state');
            }
        },
        initUI(){
            elements.createAs('style', {innerHTML:'.squirtle-subtitle-select-list>li.squirtle-select-item:after {content: "下载";}'}, document.head);
            this.panel.addEventListener('click', function(ev) {
                if (!(ev.target instanceof HTMLLIElement)) return;
                const rect = ev.target.getBoundingClientRect().right;
                if (rect ==0 || rect -ev.x > 30) return;
                const subtitleName = ev.target.lastChild.data;
                bilibiliCCHelper.getSubtitle(undefined, subtitleName).then(data=>{
                    const item = bilibiliCCHelper.getSubtitleInfo(undefined, subtitleName);
                    encoder.showDialog(data,ev.ctrlKey,item && item.lan);
                }).catch(e=>{
                    bilibiliCCHelper.toast('获取字幕失败',e);
                });
                return false;
            });
            this.panel.id = 'bilibili-player-subtitle-btn';
            console.log('Bilibili CC Helper init new Bangumi UI success.');
        },
        init(subtitle){
            this.hasSubtitles = subtitle.count;
            this.selectedLan = undefined;
            this.selectedLocal = false;
            this.iconBtn = elements.getAs('.squirtle-subtitle-wrap');
            this.panel = elements.getAs('.squirtle-subtitle-select-list');
            this.icon = this.iconBtn.querySelector('.squirtle-subtitle-icon');
            if (!this.iconBtn) {
                throw('找不到新播放器按钮');
            }
            if(this.panel) this.initUI();
        },
    };

    //启动器
    const bilibiliCCHelper = {
        window:"undefined"==typeof(unsafeWindow)?window:unsafeWindow,
         player:undefined,
         cid:undefined,
         subtitle:undefined,
         datas:undefined,
         menuCommandsRegistered:false,
         floatButton:null,
         floatButtonHiddenThisPage:false,
         floatButtonPrefKey:'bilibili_cc_float_button_hidden_v1',
         registerMenuCommands(){
             if(this.menuCommandsRegistered || typeof GM_registerMenuCommand !== 'function') return;
             this.menuCommandsRegistered = true;
             GM_registerMenuCommand('打开字幕下载窗口', ()=>this.openDownloadDialog());
             GM_registerMenuCommand('批量下载字幕', ()=>this.openBatchDialog());
             GM_registerMenuCommand('打开/关闭悬浮按钮（全局设置）', ()=>this.toggleFloatingButtonGlobal());
         },
         createFloatingButton(){
             if(this.floatButton || !document.body) return;
             const self = this;
             this.floatButton = elements.createAs('div', {
                 id:'cc-subtitle-download-trigger',
                 style:'position:fixed;top:110px;right:24px;z-index:1048577;width:44px;height:44px;background:linear-gradient(135deg,#00a1d6,#00b5e5);border-radius:12px;box-shadow:0 4px 14px rgba(0,161,214,0.35);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px;user-select:none;-webkit-tap-highlight-color:transparent;',
                 innerHTML:'📜',
                 title:'字幕下载 — 左键打开，右键设置',
                 onmouseenter:function(){
                     this.style.transform='scale(1.1)';
                     this.style.boxShadow='0 6px 20px rgba(0,161,214,0.55)';
                 },
                 onmouseleave:function(){
                     this.style.transform='scale(1)';
                     this.style.boxShadow='0 4px 14px rgba(0,161,214,0.35)';
                 },
                 onclick:function(){ self.openDownloadDialog(); },
                 oncontextmenu:function(e){
                     e.preventDefault();
                     e.stopPropagation();
                     self.showFloatingButtonMenu(e.clientX, e.clientY);
                     return false;
                 }
             }, document.body);
             this.applyFloatingButtonVisibility();
         },
         applyFloatingButtonVisibility(){
             if(!this.floatButton) return;
             const state = uiManager.loadState(this.floatButtonPrefKey,{hidden:false});
             this.floatButton.style.display = this.floatButtonHiddenThisPage || state.hidden ? 'none' : 'flex';
         },
         toggleFloatingButtonGlobal(){
             const state = uiManager.loadState(this.floatButtonPrefKey,{hidden:false});
             uiManager.saveState(this.floatButtonPrefKey,{hidden:!state.hidden});
             this.floatButtonHiddenThisPage = false;
             this.applyFloatingButtonVisibility();
             this.toast(state.hidden ? '悬浮按钮已打开' : '悬浮按钮已关闭');
         },
         hideFloatingButtonTemporarily(){
             this.floatButtonHiddenThisPage = true;
             this.applyFloatingButtonVisibility();
             this.toast('悬浮按钮已临时关闭');
         },
         hideFloatingButtonPermanently(){
             uiManager.saveState(this.floatButtonPrefKey,{hidden:true});
             this.floatButtonHiddenThisPage = true;
             this.applyFloatingButtonVisibility();
             this.toast('悬浮按钮已永久关闭，可从插件菜单重新打开');
         },
         showFloatingButtonMenu(x,y){
             const oldMenu = document.getElementById('cc-subtitle-button-menu');
             oldMenu && oldMenu.remove();
             const menu = elements.createAs('div', {
                 id:'cc-subtitle-button-menu',
                 style:'position:fixed;z-index:1048578;min-width:190px;padding:6px 0;background:#fff;border:1px solid #e5e9ef;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,.18);font-size:14px;color:#18191c;'
             }, document.body);
             const addItem = (label, handler) => elements.createAs('div', {
                 innerText:label,
                 style:'padding:9px 14px;cursor:pointer;white-space:nowrap;',
                 onmouseenter:function(){ this.style.background='#f1f2f3'; },
                 onmouseleave:function(){ this.style.background='#fff'; },
                 onclick:function(e){
                     e.stopPropagation();
                     menu.remove();
                     handler();
                 }
             }, menu);
             addItem('打开字幕下载窗口', ()=>this.openDownloadDialog());
             addItem('批量下载字幕', ()=>this.openBatchDialog());
             addItem('临时关闭悬浮按钮（本页）', ()=>this.hideFloatingButtonTemporarily());
             addItem('永久关闭悬浮按钮', ()=>this.hideFloatingButtonPermanently());
             const width = 210;
             const height = 122;
             menu.style.left = Math.max(8, Math.min(x, window.innerWidth - width - 8)) + 'px';
             menu.style.top = Math.max(8, Math.min(y, window.innerHeight - height - 8)) + 'px';
             const close = (e) => {
                 if(!menu.contains(e.target)) {
                     menu.remove();
                     document.removeEventListener('mousedown', close, true);
                 }
             };
             setTimeout(()=>document.addEventListener('mousedown', close, true), 0);
         },
         getBatchItems(){
             const state = this.window.__INITIAL_STATE__ || {};
             const videoData = state.videoData || this.getInfo('videoData') || {};
             const current = {
                 bvid:this.getInfo('bvid') || this.bvid,
                 aid:this.getInfo('aid') || this.aid,
                 cid:this.cid,
                 ep_id:this.epid,
                 title:this.getInfo('h1Title') || document.title
             };
             const normalize = (raw,index,defaults={}) => {
                 if(!raw) return null;
                 const source = raw.episode || raw.video || raw;
                 const bvid = source.bvid || source.bv_id || raw.bvid || defaults.bvid;
                 const aid = source.aid || raw.aid || defaults.aid;
                 const cid = source.cid || raw.cid || defaults.cid || source.pages?.[0]?.cid;
                 const ep_id = source.ep_id || source.epid || raw.ep_id || raw.epid || defaults.ep_id;
                 if(!cid && !ep_id && !bvid && !aid) return null;
                 const title = source.part || source.title || source.show_title || source.arc?.title
                     || raw.part || raw.title || defaults.title || `选集 ${index + 1}`;
                 return {bvid,aid,cid,ep_id,title:String(title).trim() || `选集 ${index + 1}`};
             };
             const unique = (items) => {
                 const seen = new Set();
                 return items.filter(item=>{
                     const key = item.cid ? `cid:${item.cid}` : item.ep_id ? `ep:${item.ep_id}` : `${item.bvid || ''}:${item.aid || ''}`;
                     if(seen.has(key)) return false;
                     seen.add(key);
                     return true;
                 });
             };
             const domEpisodes = Array.from(document.querySelectorAll(
                 '.bpx-player-ctrl-eplist-multi-menu-item[data-cid], .bilibili-player-video-sections-item[data-cid], .bilibili-player-video-section-list-item[data-cid]'
             )).map((node,index)=>normalize({
                 cid:node.dataset.cid,
                 title:node.querySelector('.bpx-player-ctrl-eplist-multi-menu-item-text')?.textContent?.trim()
                     || node.textContent?.trim()
             },index,current)).filter(Boolean);
             const domItems = unique(domEpisodes);
             if(domItems.length) {
                 return {label:`播放器选集（${domItems.length}集）`,items:domItems};
             }
             const collection = state.ugc_season || state.ugcSeason || videoData.ugc_season
                 || videoData.ugcSeason || this.getInfo('ugc_season') || this.window.ugc_season;
             const collectionRaw = [];
             if(Array.isArray(collection?.sections)) {
                 collection.sections.forEach(section=>{
                     if(Array.isArray(section?.episodes)) collectionRaw.push(...section.episodes);
                 });
             }
             if(Array.isArray(collection?.episodes)) collectionRaw.push(...collection.episodes);
             const collectionItems = unique(collectionRaw.map((item,index)=>normalize(item,index,current)).filter(Boolean));
             if(collectionItems.length) {
                 return {label:`合集（${collectionItems.length}集）`,items:collectionItems};
             }

             const pages = videoData.pages || state.pages || [];
             const pageItems = Array.isArray(pages)
                 ? unique(pages.map((item,index)=>normalize(item,index,current)).filter(Boolean)) : [];
             if(pageItems.length) {
                 return {label:`当前视频选集（${pageItems.length}集）`,items:pageItems};
             }

             const seasonData = this.window.__NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries
                 ?.find(query=>query?.queryKey?.[0] == 'pgc/view/web/season')?.state?.data;
             const seasonEpisodes = (seasonData?.seasonInfo ?? seasonData)?.mediaInfo?.episodes
                 || seasonData?.episodes || state.epList || [];
             const seasonItems = Array.isArray(seasonEpisodes)
                 ? unique(seasonEpisodes.map((item,index)=>normalize(item,index,current)).filter(Boolean)) : [];
             if(seasonItems.length) {
                 return {label:`合集/选集（${seasonItems.length}集）`,items:seasonItems};
             }

             const currentItem = normalize(current,0,current);
             return {label:'当前视频',items:currentItem ? [currentItem] : []};
         },
         getBatchLanguageOptions(){
             const result = [{value:'__auto__',label:'自动选择可用语言'}];
             const seen = new Set();
             (this.subtitle?.subtitles || []).forEach(item=>{
                 if(item.lan === 'close' || item.lan === 'local' || !item.lan || seen.has(item.lan)) return;
                 seen.add(item.lan);
                 result.push({value:item.lan,label:item.lan_doc || item.lan});
             });
             return result;
         },
         async fetchBatchSubtitleConfig(item){
             const params = [];
             if(item.cid) params.push(`cid=${encodeURIComponent(item.cid)}`);
             else if(item.ep_id) params.push(`ep_id=${encodeURIComponent(item.ep_id)}`);
             if(item.aid) params.push(`aid=${encodeURIComponent(item.aid)}`);
             else if(item.bvid) params.push(`bvid=${encodeURIComponent(item.bvid)}`);
             if(!params.length) throw '缺少视频参数';
             const url = `https://api.bilibili.com/x/player${item.cid ? '/wbi' : ''}/v2?${params.join('&')}`;
             let ret = await fetch(url,{credentials:'include'}).then(res=>res.json());
             let subtitle;
             if(ret.code === -404 && item.cid) {
                 const dmParams = item.aid ? `aid=${encodeURIComponent(item.aid)}` : `bvid=${encodeURIComponent(item.bvid || '')}`;
                 ret = await fetch(`https://api.bilibili.com/x/v2/dm/view?${dmParams}&oid=${encodeURIComponent(item.cid)}&type=1`,{credentials:'include'}).then(res=>res.json());
                 if(ret.code !== 0) throw ret.message || '无法读取字幕配置';
                 subtitle = ret.data?.subtitle;
             } else {
                 if(ret.code !== 0 || !ret.data?.subtitle) throw ret.message || `读取字幕配置失败（${ret.code}）`;
                 subtitle = ret.data.subtitle;
             }
             const subtitles = (subtitle?.subtitles || []).filter(info=>info.lan !== 'close' && info.lan !== 'local' && info.subtitle_url);
             if(!subtitles.length) throw '该集没有可下载字幕';
             return {subtitles};
         },
         async fetchBatchSubtitle(item,language){
             const config = await this.fetchBatchSubtitleConfig(item);
             const info = language === '__auto__' ? config.subtitles[0] : config.subtitles.find(subtitle=>subtitle.lan === language);
             if(!info) throw `没有语言为“${language}”的字幕`;
             const subtitleUrl = new URL(String(info.subtitle_url).replace(/^https?:\/\//,'//'),location.href).href;
             // 字幕 CDN 通常不允许跨域携带凭据；这里保持和原单集下载一样使用默认凭据策略。
             const response = await fetch(subtitleUrl);
             if(!response.ok && response.status !== 0) throw `字幕请求失败（${response.status}）`;
             const data = await response.json();
             if(!data || !Array.isArray(data.body)) throw '字幕数据格式错误';
             return {data,language:info.lan_doc || info.lan};
         },
         encodeBatchSubtitle(data,type){
             switch(String(type).toUpperCase()) {
                 case 'ASS': return encoder.encodeToASS(data.body);
                 case 'SRT': return encoder.encodeToSRT(data.body);
                 case 'LRC': return encoder.encodeToLRC(data.body);
                 case 'VTT': return encoder.encodeToVTT(data.body);
                 case 'TXT': return data.body.map(item=>item.content).join('\r\n');
                 case 'BCC': return JSON.stringify(data,undefined,2);
                 default: throw `不支持的格式：${type}`;
             }
         },
         safeBatchName(name){
             return String(name || '字幕').replace(/[\\/:*?"<>|]/g,'_').replace(/\s+/g,' ').trim().slice(0,100) || '字幕';
         },
         crc32(bytes){
             let crc = 0xffffffff;
             for(const byte of bytes) {
                 crc ^= byte;
                 for(let bit=0;bit<8;bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
             }
             return (crc ^ 0xffffffff) >>> 0;
         },
         createSubtitleZip(entries){
             const textEncoder = new TextEncoder();
             const localParts = [];
             const centralParts = [];
             let offset = 0;
             const set16 = (view,position,value)=>view.setUint16(position,value,true);
             const set32 = (view,position,value)=>view.setUint32(position,value,true);
             entries.forEach(entry=>{
                 const nameBytes = textEncoder.encode(entry.name);
                 const dataBytes = textEncoder.encode(entry.content);
                 const crc = this.crc32(dataBytes);
                 const local = new Uint8Array(30);
                 const localView = new DataView(local.buffer);
                 set32(localView,0,0x04034b50);
                 set16(localView,4,20); set16(localView,6,0x800); set16(localView,8,0);
                 set16(localView,10,0); set16(localView,12,0);
                 set32(localView,14,crc); set32(localView,18,dataBytes.length); set32(localView,22,dataBytes.length);
                 set16(localView,26,nameBytes.length); set16(localView,28,0);
                 localParts.push(local,nameBytes,dataBytes);

                 const central = new Uint8Array(46);
                 const centralView = new DataView(central.buffer);
                 set32(centralView,0,0x02014b50);
                 set16(centralView,4,20); set16(centralView,6,20); set16(centralView,8,0x800); set16(centralView,10,0);
                 set16(centralView,12,0); set16(centralView,14,0);
                 set32(centralView,16,crc); set32(centralView,20,dataBytes.length); set32(centralView,24,dataBytes.length);
                 set16(centralView,28,nameBytes.length); set16(centralView,30,0); set16(centralView,32,0);
                 set16(centralView,34,0); set16(centralView,36,0); set32(centralView,38,0); set32(centralView,42,offset);
                 centralParts.push(central,nameBytes);
                 offset += local.length + nameBytes.length + dataBytes.length;
             });
             const centralOffset = offset;
             const centralSize = centralParts.reduce((total,part)=>total + part.length,0);
             const end = new Uint8Array(22);
             const endView = new DataView(end.buffer);
             set32(endView,0,0x06054b50); set16(endView,4,0); set16(endView,6,0);
             set16(endView,8,entries.length); set16(endView,10,entries.length);
             set32(endView,12,centralSize); set32(endView,16,centralOffset); set16(endView,20,0);
             return new Blob([...localParts,...centralParts,end],{type:'application/zip'});
         },
         downloadBatchBlob(blob,name){
             const url = URL.createObjectURL(blob);
             const link = elements.createAs('a',{href:url,download:name,style:'display:none;'},document.body);
             link.click();
             setTimeout(()=>{ URL.revokeObjectURL(url); link.remove(); },15000);
         },
         async startBatchDownload(items,language,type,status,startButton){
             if(startButton.dataset.busy === '1') return;
             startButton.dataset.busy = '1';
             startButton.style.opacity = '0.65';
             startButton.style.pointerEvents = 'none';
             const entries = [];
             const failed = [];
             for(let index=0;index<items.length;index++) {
                 const item = items[index];
                 status.innerText = `正在获取 ${index + 1}/${items.length}：${item.title}`;
                 try {
                     const result = await this.fetchBatchSubtitle(item,language);
                     const extension = String(type).toLowerCase();
                     entries.push({
                         name:`${String(index + 1).padStart(2,'0')}_${this.safeBatchName(item.title)}.${extension}`,
                         content:this.encodeBatchSubtitle(result.data,type)
                     });
                 } catch(error) {
                     failed.push(`${item.title}：${error}`);
                 }
             }
             if(entries.length) {
                 const zipName = `Bilibili字幕批量下载_${new Date().toISOString().slice(0,10)}.zip`;
                 this.downloadBatchBlob(this.createSubtitleZip(entries),zipName);
             }
             startButton.dataset.busy = '0';
             startButton.style.opacity = '1';
             startButton.style.pointerEvents = 'auto';
             status.innerText = failed.length
                 ? `完成：${entries.length} 集，失败：${failed.length} 集（${failed.slice(0,2).join('；')}${failed.length > 2 ? '；…' : ''}）`
                 : `完成：${entries.length} 集，已下载 ZIP 文件`;
             if(entries.length) encoder.showToast(`✅ 批量字幕已打包：${entries.length} 集`);
             else encoder.showToast('❌ 没有成功获取字幕','error');
         },
         createBatchDialog(items,sourceLabel){
             const oldDialog = document.getElementById('cc-batch-dialog');
             oldDialog && oldDialog.remove();
             const overlay = elements.createAs('div',{
                 id:'cc-batch-dialog',
                 style:'position:fixed;inset:0;background:transparent;pointer-events:none;z-index:1048576;'
             },document.body);
             const panel = elements.createAs('div',{
                 style:'position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:680px;max-width:calc(100vw - 30px);box-sizing:border-box;padding:18px;background:#fff;border-radius:8px;box-shadow:0 4px 18px rgba(0,0,0,.2);pointer-events:auto;color:#18191c;font-size:14px;'
             },overlay);
             if(!document.getElementById('cc-batch-dialog-style')) {
                 elements.createAs('style',{
                     id:'cc-batch-dialog-style',
                     innerHTML:'@media (max-width:720px){.cc-batch-control-panel{grid-template-columns:auto minmax(0,1fr) auto minmax(0,1fr)!important}.cc-batch-control-panel>:nth-child(5){grid-column:1}.cc-batch-control-panel>:nth-child(6){grid-column:2}}'
                 },document.head);
             }
             const header = elements.createAs('div',{
                 innerText:'批量下载字幕',
                 style:'font-size:20px;line-height:26px;color:#00a1d6;font-weight:500;margin-bottom:12px;'
             },panel);
             elements.createAs('span',{
                 innerText:sourceLabel,
                 style:'display:block;color:#99a2aa;font-size:12px;margin-bottom:10px;'
             },panel);
             const controlPanel = elements.createAs('div',{className:'cc-batch-control-panel',style:'display:grid;grid-template-columns:auto minmax(150px,1fr) auto minmax(180px,1.2fr) auto 90px;column-gap:10px;row-gap:8px;align-items:center;margin-bottom:10px;'},panel);
             elements.createAs('span',{innerText:'范围：'},controlPanel);
             const scopeSelect = elements.createAs('select',{
                 style:'height:30px;width:100%;min-width:0;box-sizing:border-box;',
                 innerHTML:`<option value="all">合集（全部 ${items.length} 集）</option><option value="selected">选集（勾选项目）</option>`
             },controlPanel);
             elements.createAs('span',{innerText:'语言：'},controlPanel);
             const languageSelect = elements.createAs('select',{style:'height:30px;width:100%;min-width:0;box-sizing:border-box;'},controlPanel);
             this.getBatchLanguageOptions().forEach(option=>elements.createAs('option',{value:option.value,innerText:option.label},languageSelect));
             elements.createAs('span',{innerText:'格式：'},controlPanel);
             const formatSelect = elements.createAs('select',{
                 style:'height:30px;width:90px;min-width:90px;box-sizing:border-box;',
                 innerHTML:['ASS','SRT','LRC','VTT','TXT','BCC'].map(type=>`<option value="${type}">${type}</option>`).join(''),
                 value:localStorage.defaultSubtitleType || 'SRT'
             },controlPanel);
             const selectionHeader = elements.createAs('div',{style:'display:flex;align-items:center;border-bottom:1px solid #e5e9ef;padding:6px 4px;'},panel);
             const allToggle = elements.createAs('input',{type:'checkbox',checked:true},selectionHeader);
             elements.createAs('span',{innerText:'全选 / 取消全选',style:'margin-left:6px;'},selectionHeader);
             const list = elements.createAs('div',{style:'max-height:280px;overflow:auto;border:1px solid #e5e9ef;border-top:0;padding:4px 8px;'},panel);
             const checks = [];
             items.forEach((item,index)=>{
                 const row = elements.createAs('label',{style:'display:flex;align-items:center;gap:7px;min-height:30px;border-bottom:1px solid #f1f2f3;cursor:pointer;'},list);
                 const checkbox = elements.createAs('input',{type:'checkbox',checked:true},row);
                 checks.push(checkbox);
                 checkbox.onchange = ()=>{ allToggle.checked = checks.every(check=>check.checked); };
                 elements.createAs('span',{innerText:`${index + 1}. ${item.title}`,style:'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;'},row);
             });
             allToggle.onchange = ()=>checks.forEach(check=>check.checked = allToggle.checked);
             const status = elements.createAs('div',{innerText:'选择范围、语言和格式后，点击开始批量下载。文件会打包为 ZIP。',style:'color:#99a2aa;font-size:12px;line-height:20px;min-height:20px;margin-top:10px;'},panel);
             const actions = elements.createAs('div',{style:'display:flex;justify-content:flex-end;gap:8px;margin-top:10px;'},panel);
             const closeButton = elements.createAs('a',{innerText:'关闭',style:'height:24px;background:#99a2aa;color:#fff;padding:7px 14px;cursor:pointer;border-radius:2px;',onclick:()=>overlay.remove()},actions);
             const startButton = elements.createAs('a',{innerText:'开始批量下载',style:'height:24px;background:#00a1d6;color:#fff;padding:7px 14px;cursor:pointer;border-radius:2px;'},actions);
             startButton.onclick = () => {
                 const selected = scopeSelect.value === 'all' ? items : items.filter((item,index)=>checks[index].checked);
                 if(!selected.length){ status.innerText = '请至少勾选一集。'; return; }
                 this.startBatchDownload(selected,languageSelect.value,formatSelect.value,status,startButton);
             };
         },
         openBatchDialog(){
             this.setupData().then(subtitle=>{
                 if(!subtitle) throw '当前页面还没有读取到视频信息';
                 const batch = this.getBatchItems();
                 if(!batch.items.length) throw '没有找到可批量处理的合集或选集';
                 this.createBatchDialog(batch.items,batch.label);
             }).catch(error=>{
                 console.error('打开批量下载窗口失败',error);
                 if(typeof encoder !== 'undefined' && encoder.showToast) {
                     encoder.showToast(`❌ 打开批量下载失败：${error}`,'error');
                 } else {
                     this.toast('打开批量下载窗口失败',error);
                 }
             });
         },
         openDownloadDialog(){
             this.setupData().then(subtitle=>{
                 const languages = (subtitle?.subtitles || []).filter(item=>item.lan !== 'close' && item.lan !== 'local');
                 if(!languages.length) throw '当前视频没有可用的在线字幕';
                 const lan = encoder.currentLan && languages.some(item=>item.lan === encoder.currentLan)
                     ? encoder.currentLan : languages[0].lan;
                 return this.getSubtitle(lan).then(data=>encoder.showDialog(data,false,lan));
             }).catch(e=>this.toast('打开字幕窗口失败',e));
         },
         toast(msg,error){
            if(error) console.error(msg,error);
            if(!this.toastDiv){
                this.toastDiv = document.createElement('div');
                this.toastDiv.className = 'bilibili-player-video-toast-item';
            }
            const panel = elements.getAs('.bilibili-player-video-toast-top');
            if(!panel) return;
            clearTimeout(this.removeTimmer);
            this.toastDiv.innerText = msg + (error?`:${error}`:'');
            panel.appendChild(this.toastDiv);
            this.removeTimmer = setTimeout(()=>{
                panel.contains(this.toastDiv)&&panel.removeChild(this.toastDiv)
            },3000);
        },
        async updateLocal(data){
            this.datas.local = data;
            return this.updateSubtitle(data);
        },
        async updateSubtitle(data){
            this.window.player.updateSubtitle(data);
        },
        loadSubtitle(lan){
            this.getSubtitle(lan)
                .catch(()=>this.setupData(true)).then(()=>this.getSubtitle(lan))
                .then(data=>this.updateSubtitle(data))
                .then(()=>this.toast(lan=='close'?'字幕已关闭':`载入字幕:${this.getSubtitleInfo(lan).lan_doc}`))
                .catch(e=>this.toast('载入字幕失败',e));
        },
         downloadSubtitle(lan, name, direct){
             this.getSubtitle(lan,name)
                 .catch(()=>this.setupData(true)).then(()=>this.getSubtitle(lan, name))
                 .then(data=>{
                     const item = this.getSubtitleInfo(lan,name);
                     return encoder.showDialog(data,direct,item && item.lan);
                 }).catch(e=>bilibiliCCHelper.toast('获取字幕失败',e));
         },
        async getSubtitle(lan, name){
            if(this.datas[lan]) return this.datas[lan];
            const item = this.getSubtitleInfo(lan, name);
            if(!item) throw('找不到所选语言字幕'+lan);
            if(this.datas[item.lan]) return this.datas[item.lan];
            return fetch(item.subtitle_url)
                .then(res=>res.json())
                .then(data=>(this.datas[item.lan] = data));
        },
        getSubtitleInfo(lan, name){
            return this.subtitle.subtitles.find(item=>item.lan==lan || item.lan_doc==name);
        },
        getInfo(name) {
            return this.window[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__.epInfo && this.window.__INITIAL_STATE__.epInfo[name]
            || this.window.__INITIAL_STATE__ && this.window.__INITIAL_STATE__.videoData && this.window.__INITIAL_STATE__.videoData[name];
        },
        getEpid(){
            return this.getInfo('id')
            || /ep(\d+)/.test(location.pathname) && +RegExp.$1
            || /ss\d+/.test(location.pathname);
        },
        getEpInfo(){
            const bvid = this.getInfo('bvid'),
                  epid = this.getEpid(),
                  cidMap = this.getInfo('cidMap'),
                  page = this?.window?.__INITIAL_STATE__?.p;
            let ep = cidMap?.[bvid];
            if (ep) {
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                this.cid = ep.cids[page];
                return this.cid;
            }
            ep = this.window.__NEXT_DATA__?.props?.pageProps?.dehydratedState?.queries
            ?.find(query=>query?.queryKey?.[0] == "pgc/view/web/season")
            ?.state?.data;
            ep = (ep?.seasonInfo??ep)?.mediaInfo?.episodes
            ?.find(ep=>epid == true || ep.ep_id == epid);
            if (ep) {
                this.epid = ep.ep_id;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
            ep = this.window.__INITIAL_STATE__?.epInfo;
            if (ep){
                this.epid = ep.id;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
            ep = this.window.playerRaw?.getManifest();
            if (ep){
                this.epid = ep.episodeId;
                this.cid = ep.cid;
                this.aid = ep.aid;
                this.bvid = ep.bvid;
                return this.cid;
            }
        },
        async setupData(force){
            if(this.subtitle && (this.pcid == this.getEpInfo()) && !force) return this.subtitle;
            if(location.pathname=='/blackboard/html5player.html') {
                let match = location.search.match(/cid=(\d+)/i);
                if(!match) return;
                this.window.cid = match[1];
                match = location.search.match(/aid=(\d+)/i);
                if(match) this.window.aid = match[1];
                match = location.search.match(/bvid=(\d+)/i);
                if(match) this.window.bvid = match[1];
            }
            this.pcid = this.getEpInfo();
            if((!this.cid&&!this.epid)||(!this.aid&&!this.bvid)) return;
            this.player = this.window.player;
            this.subtitle = {count:0,subtitles:[{lan:'close',lan_doc:'关闭'},{lan:'local',lan_doc:'本地字幕'}]};
            if (!force) this.datas = {close:{body:[]},local:{body:[]}};
            decoder.data = undefined;
            return fetch(`https://api.bilibili.com/x/player${this.cid?'/wbi':''}/v2?${this.cid?`cid=${this.cid}`:`&ep_id=${this.epid}`}${this.aid?`&aid=${this.aid}`:`&bvid=${this.bvid}`}`, {credentials: 'include'}).then(res=>{
                if (res.status==200) {
                    return res.json().then(ret=>{
                        if (ret.code == -404) {
                            return fetch(`//api.bilibili.com/x/v2/dm/view?${this.aid?`aid=${this.aid}`:`bvid=${this.bvid}`}&oid=${this.cid}&type=1`, {credentials: 'include'}).then(res=>{
                                return res.json()
                            }).then(ret=>{
                                if (ret.code!=0) throw('无法读取本视频APP字幕配置'+ret.message);
                                this.subtitle = ret.data && ret.data.subtitle || {subtitles:[]};
                                this.subtitle.count = this.subtitle.subtitles.length;
                                this.subtitle.subtitles.forEach(item=>(item.subtitle_url = item.subtitle_url.replace(/https?:\/\//,'//')))
                                this.subtitle.subtitles.push({lan:'close',lan_doc:'关闭'},{lan:'local',lan_doc:'本地字幕'});
                                this.subtitle.allow_submit = false;
                                return this.subtitle;
                            });
                        }
                        if(ret.code!=0||!ret.data||!ret.data.subtitle) throw('读取视频字幕配置错误:'+ret.code+ret.message);
                        this.subtitle = ret.data.subtitle;
                        this.subtitle.count = this.subtitle.subtitles.length;
                        this.subtitle.subtitles.push({lan:'close',lan_doc:'关闭'},{lan:'local',lan_doc:'本地字幕'});
                        return this.subtitle;
                    });
                }
                else {
                    throw('请求字幕配置失败:'+res.statusText);
                }
            })
        },
        tryInit(){
            this.setupData().then(subtitle=>{
                if(!subtitle) return;
                if(elements.getAs('#bilibili-player-subtitle-btn')) {
                    console.log('CC助手已初始化');
                }
                else if(elements.getAs('.bilibili-player-video-btn-color')){
                    oldPlayerHelper.init(subtitle);
                }
                else if(elements.getAs('.bilibili-player-video-danmaku-setting')){
                    player2x.init(subtitle);
                }
                else if (elements.getAs('.bpx-player-ctrl-subtitle-major-content')){
                    player315.init(subtitle);
                }
                else if(elements.getAs('.squirtle-subtitle-wrap')){
                    player314.init(subtitle);
                }
                else {
                    console.log('bilibili cc未发现可识别版本播放器')
                }
            }).catch(e=>{
                this.toast('CC字幕助手配置失败',e);
            });
        },
         init(){
             this.registerMenuCommands();
             this.createFloatingButton();
             this.tryInit();
            new MutationObserver((mutations, observer)=>{
                for (const mutation of mutations){
                    if(!mutation.target) return;
                    if(mutation.target.getAttribute('stage')==1
                       || mutation.target.classList.contains('bpx-player-subtitle-wrap') || mutation.target.classList.contains('tit')
                       || mutation.target.classList.contains('bpx-player-ctrl-subtitle-bilingual')
                       || mutation.target.classList.contains('squirtle-quality-wrap')){
                        this.tryInit();
                        break;
                    }
                }
            }).observe(document.body,{
                childList: true,
                subtree: true,
            });
        }
     };
     bilibiliCCHelper.init();
 })();

