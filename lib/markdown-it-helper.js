"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const markdownItModule = require("markdown-it");
const twemoji = require("twemoji");
const path = require("path");
const util_1 = require("./util");
const _ = require("lodash");
let markdownIt = null;
let markdownItOptions = null;
let renderLaTeX = null;
let math = null;
let lazyHeaders = null;
let checkBoxes = null;
let emoji = null;
let inlineMathSeparators = null;
let blockMathSeparators = null;
const mathInline = (text) => `<span class='math'><script type='math/tex'>${text}</script></span>`;
const mathBlock = (text) => `<span class='math'><script type='math/tex; mode=display'>${text}</script></span>`;
const getOptions = () => ({
    html: true,
    xhtmlOut: false,
    breaks: atom.config.get('markdown-preview-plus.breakOnSingleNewline'),
    langPrefix: 'lang-',
    linkify: true,
    typographer: true,
});
function init(rL) {
    renderLaTeX = rL;
    markdownItOptions = getOptions();
    markdownIt = markdownItModule(markdownItOptions);
    if (renderLaTeX) {
        if (math == null) {
            math = require('./markdown-it-math').math_plugin;
        }
        const inlineDelim = util_1.pairUp((inlineMathSeparators = atom.config.get('markdown-preview-plus.inlineMathSeparators')), 'inlineMathSeparators');
        const blockDelim = util_1.pairUp((blockMathSeparators = atom.config.get('markdown-preview-plus.blockMathSeparators')), 'blockMathSeparators');
        markdownIt.use(math, {
            inlineDelim,
            blockDelim,
            inlineRenderer: mathInline,
            blockRenderer: mathBlock,
        });
    }
    lazyHeaders = atom.config.get('markdown-preview-plus.useLazyHeaders');
    if (lazyHeaders) {
        markdownIt.use(require('markdown-it-lazy-headers'));
    }
    checkBoxes = atom.config.get('markdown-preview-plus.useCheckBoxes');
    if (checkBoxes) {
        markdownIt.use(require('markdown-it-task-lists'));
    }
    emoji = atom.config.get('markdown-preview-plus.useEmoji');
    if (emoji) {
        markdownIt.use(require('markdown-it-emoji'));
        markdownIt.renderer.rules.emoji = function (token, idx) {
            return twemoji.parse(token[idx].content, {
                folder: 'svg',
                ext: '.svg',
                base: path.dirname(require.resolve('twemoji')) + path.sep,
            });
        };
    }
}
const needsInit = (rL) => markdownIt === null ||
    markdownItOptions === null ||
    markdownItOptions.breaks !==
        atom.config.get('markdown-preview-plus.breakOnSingleNewline') ||
    lazyHeaders !== atom.config.get('markdown-preview-plus.useLazyHeaders') ||
    checkBoxes !== atom.config.get('markdown-preview-plus.useCheckBoxes') ||
    emoji !== atom.config.get('markdown-preview-plus.emoji') ||
    rL !== renderLaTeX ||
    !_.isEqual(inlineMathSeparators, atom.config.get('markdown-preview-plus.inlineMathSeparators')) ||
    !_.isEqual(blockMathSeparators, atom.config.get('markdown-preview-plus.blockMathSeparators'));
function render(text, rL) {
    if (needsInit(rL)) {
        init(rL);
    }
    return markdownIt.render(text);
}
exports.render = render;
function decode(url) {
    if (!markdownIt)
        throw new Error('markdownIt not initialized');
    return markdownIt.normalizeLinkText(url);
}
exports.decode = decode;
function getTokens(text, rL) {
    if (needsInit(rL)) {
        init(rL);
    }
    return markdownIt.parse(text, {});
}
exports.getTokens = getTokens;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFya2Rvd24taXQtaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21hcmtkb3duLWl0LWhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUFnRDtBQUNoRCxtQ0FBbUM7QUFDbkMsNkJBQTRCO0FBQzVCLGlDQUErQjtBQUMvQiw0QkFBMkI7QUFDM0IsSUFBSSxVQUFVLEdBQXVDLElBQUksQ0FBQTtBQUN6RCxJQUFJLGlCQUFpQixHQUFvQyxJQUFJLENBQUE7QUFDN0QsSUFBSSxXQUFXLEdBQW1CLElBQUksQ0FBQTtBQUN0QyxJQUFJLElBQUksR0FBUSxJQUFJLENBQUE7QUFDcEIsSUFBSSxXQUFXLEdBQVEsSUFBSSxDQUFBO0FBQzNCLElBQUksVUFBVSxHQUFRLElBQUksQ0FBQTtBQUMxQixJQUFJLEtBQUssR0FBUSxJQUFJLENBQUE7QUFDckIsSUFBSSxvQkFBb0IsR0FBUSxJQUFJLENBQUE7QUFDcEMsSUFBSSxtQkFBbUIsR0FBUSxJQUFJLENBQUE7QUFFbkMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFZLEVBQUUsRUFBRSxDQUNsQyw4Q0FBOEMsSUFBSSxrQkFBa0IsQ0FBQTtBQUN0RSxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFLENBQ2pDLDREQUE0RCxJQUFJLGtCQUFrQixDQUFBO0FBRXBGLE1BQU0sVUFBVSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEIsSUFBSSxFQUFFLElBQUk7SUFDVixRQUFRLEVBQUUsS0FBSztJQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQztJQUNyRSxVQUFVLEVBQUUsT0FBTztJQUNuQixPQUFPLEVBQUUsSUFBSTtJQUNiLFdBQVcsRUFBRSxJQUFJO0NBQ2xCLENBQUMsQ0FBQTtBQUVGLGNBQWMsRUFBVztJQUN2QixXQUFXLEdBQUcsRUFBRSxDQUFBO0lBRWhCLGlCQUFpQixHQUFHLFVB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N0QsQ0FBQTtBQUVILGdCQUF1QixJQUFZLEVBQUUsRUFBVztJQUM5QyxJQUFJLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNqQixJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7S0FDVDtJQUNELE9BQU8sVUFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUNqQyxDQUFDO0FBTEQsd0JBS0M7QUFFRCxnQkFBdUIsR0FBVztJQUNoQyxJQUFJLENBQUMsVUFBVTtRQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtJQUM5RCxPQUFPLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUMxQyxDQUFDO0FBSEQsd0JBR0M7QUFFRCxtQkFBMEIsSUFBWSxFQUFFLEVBQVc7SUFDakQsSUFBSSxTQUFTLENBQUMsRUFBRSxDQUFDLEVBQUU7UUFDakIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0tBQ1Q7SUFDRCxPQUFPLFVBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3BDLENBQUM7QUFMRCw4QkFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtYXJrZG93bkl0TW9kdWxlID0gcmVxdWlyZSgnbWFya2Rvd24taXQnKVxuaW1wb3J0IHR3ZW1vamkgPSByZXF1aXJlKCd0d2Vtb2ppJylcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCB7IHBhaXJVcCB9IGZyb20gJy4vdXRpbCdcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJ1xubGV0IG1hcmtkb3duSXQ6IG1hcmtkb3duSXRNb2R1bGUuTWFya2Rvd25JdCB8IG51bGwgPSBudWxsXG5sZXQgbWFya2Rvd25JdE9wdGlvbnM6IG1hcmtkb3duSXRNb2R1bGUuT3B0aW9ucyB8IG51bGwgPSBudWxsXG5sZXQgcmVuZGVyTGFUZVg6IGJvb2xlYW4gfCBudWxsID0gbnVsbFxubGV0IG1hdGg6IGFueSA9IG51bGxcbmxldCBsYXp5SGVhZGVyczogYW55ID0gbnVsbFxubGV0IGNoZWNrQm94ZXM6IGFueSA9IG51bGxcbmxldCBlbW9qaTogYW55ID0gbnVsbFxubGV0IGlubGluZU1hdGhTZXBhcmF0b3JzOiBhbnkgPSBudWxsXG5sZXQgYmxvY2tNYXRoU2VwYXJhdG9yczogYW55ID0gbnVsbFxuXG5jb25zdCBtYXRoSW5saW5lID0gKHRleHQ6IHN0cmluZykgPT5cbiAgYDxzcGFuIGNsYXNzPSdtYXRoJz48c2NyaXB0IHR5cGU9J21hdGgvdGV4Jz4ke3RleHR9PC9zY3JpcHQ+PC9zcGFuPmBcbmNvbnN0IG1hdGhCbG9jayA9ICh0ZXh0OiBzdHJpbmcpID0+XG4gIGA8c3BhbiBjbGFzcz0nbWF0aCc+PHNjcmlwdCB0eXBlPSdtYXRoL3RleDsgbW9kZT1kaXNwbGF5Jz4ke3RleHR9PC9zY3JpcHQ+PC9zcGFuPmBcblxuY29uc3QgZ2V0T3B0aW9ucyA9ICgpID0+ICh7XG4gIGh0bWw6IHRydWUsXG4gIHhodG1sT3V0OiBmYWxzZSxcbiAgYnJlYWtzOiBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLXByZXZpZXctcGx1cy5icmVha09uU2luZ2xlTmV3bGluZScpLFxuICBsYW5nUHJlZml4OiAnbGFuZy0nLFxuICBsaW5raWZ5OiB0cnVlLFxuICB0eXBvZ3JhcGhlcjogdHJ1ZSxcbn0pXG5cbmZ1bmN0aW9uIGluaXQockw6IGJvb2xlYW4pIHtcbiAgcmVuZGVyTGFUZVggPSByTFxuXG4gIG1hcmtkb3duSXRPcHRpb25zID0gZ2V0T3B0aW9ucygpXG5cbiAgbWFya2Rvd25JdCA9IG1hcmtkb3duSXRNb2R1bGUobWFya2Rvd25JdE9wdGlvbnMpXG5cbiAgaWYgKHJlbmRlckxhVGVYKSB7XG4gICAgaWYgKG1hdGggPT0gbnVsbCkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuc2FmZS1hbnlcbiAgICAgIG1hdGggPSByZXF1aXJlKCcuL21hcmtkb3duLWl0LW1hdGgnKS5tYXRoX3BsdWdpblxuICAgIH1cbiAgICBjb25zdCBpbmxpbmVEZWxpbSA9IHBhaXJVcChcbiAgICAgIChpbmxpbmVNYXRoU2VwYXJhdG9ycyA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ21hcmtkb3duLXByZXZpZXctcGx1cy5pbmxpbmVNYXRoU2VwYXJhdG9ycycsXG4gICAgICApKSxcbiAgICAgICdpbmxpbmVNYXRoU2VwYXJhdG9ycycsXG4gICAgKVxuICAgIGNvbnN0IGJsb2NrRGVsaW0gPSBwYWlyVXAoXG4gICAgICAoYmxvY2tNYXRoU2VwYXJhdG9ycyA9IGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ21hcmtkb3duLXByZXZpZXctcGx1cy5ibG9ja01hdGhTZXBhcmF0b3JzJyxcbiAgICAgICkpLFxuICAgICAgJ2Jsb2NrTWF0aFNlcGFyYXRvcnMnLFxuICAgIClcbiAgICBtYXJrZG93bkl0LnVzZShtYXRoLCB7XG4gICAgICBpbmxpbmVEZWxpbSxcbiAgICAgIGJsb2NrRGVsaW0sXG4gICAgICBpbmxpbmVSZW5kZXJlcjogbWF0aElubGluZSxcbiAgICAgIGJsb2NrUmVuZGVyZXI6IG1hdGhCbG9jayxcbiAgICB9KVxuICB9XG5cbiAgbGF6eUhlYWRlcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLXByZXZpZXctcGx1cy51c2VMYXp5SGVhZGVycycpXG5cbiAgaWYgKGxhenlIZWFkZXJzKSB7XG4gICAgbWFya2Rvd25JdC51c2UocmVxdWlyZSgnbWFya2Rvd24taXQtbGF6eS1oZWFkZXJzJykpXG4gIH1cblxuICBjaGVja0JveGVzID0gYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMudXNlQ2hlY2tCb3hlcycpXG5cbiAgaWYgKGNoZWNrQm94ZXMpIHtcbiAgICBtYXJrZG93bkl0LnVzZShyZXF1aXJlKCdtYXJrZG93bi1pdC10YXNrLWxpc3RzJykpXG4gIH1cblxuICBlbW9qaSA9IGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24tcHJldmlldy1wbHVzLnVzZUVtb2ppJylcblxuICBpZiAoZW1vamkpIHtcbiAgICBtYXJrZG93bkl0LnVzZShyZXF1aXJlKCdtYXJrZG93bi1pdC1lbW9qaScpKVxuICAgIG1hcmtkb3duSXQucmVuZGVyZXIucnVsZXMuZW1vamkgPSBmdW5jdGlvbih0b2tlbiwgaWR4KSB7XG4gICAgICByZXR1cm4gdHdlbW9qaS5wYXJzZSh0b2tlbltpZHhdLmNvbnRlbnQsIHtcbiAgICAgICAgZm9sZGVyOiAnc3ZnJyxcbiAgICAgICAgZXh0OiAnLnN2ZycsXG4gICAgICAgIGJhc2U6IHBhdGguZGlybmFtZShyZXF1aXJlLnJlc29sdmUoJ3R3ZW1vamknKSkgKyBwYXRoLnNlcCxcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG5cbmNvbnN0IG5lZWRzSW5pdCA9IChyTDogYm9vbGVhbikgPT5cbiAgbWFya2Rvd25JdCA9PT0gbnVsbCB8fFxuICBtYXJrZG93bkl0T3B0aW9ucyA9PT0gbnVsbCB8fFxuICBtYXJrZG93bkl0T3B0aW9ucy5icmVha3MgIT09XG4gICAgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMuYnJlYWtPblNpbmdsZU5ld2xpbmUnKSB8fFxuICBsYXp5SGVhZGVycyAhPT0gYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMudXNlTGF6eUhlYWRlcnMnKSB8fFxuICBjaGVja0JveGVzICE9PSBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLXByZXZpZXctcGx1cy51c2VDaGVja0JveGVzJykgfHxcbiAgZW1vamkgIT09IGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24tcHJldmlldy1wbHVzLmVtb2ppJykgfHxcbiAgckwgIT09IHJlbmRlckxhVGVYIHx8XG4gICFfLmlzRXF1YWwoXG4gICAgaW5saW5lTWF0aFNlcGFyYXRvcnMsXG4gICAgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMuaW5saW5lTWF0aFNlcGFyYXRvcnMnKSxcbiAgKSB8fFxuICAhXy5pc0VxdWFsKFxuICAgIGJsb2NrTWF0aFNlcGFyYXRvcnMsXG4gICAgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMuYmxvY2tNYXRoU2VwYXJhdG9ycycpLFxuICApXG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXIodGV4dDogc3RyaW5nLCByTDogYm9vbGVhbikge1xuICBpZiAobmVlZHNJbml0KHJMKSkge1xuICAgIGluaXQockwpXG4gIH1cbiAgcmV0dXJuIG1hcmtkb3duSXQhLnJlbmRlcih0ZXh0KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVjb2RlKHVybDogc3RyaW5nKSB7XG4gIGlmICghbWFya2Rvd25JdCkgdGhyb3cgbmV3IEVycm9yKCdtYXJrZG93bkl0IG5vdCBpbml0aWFsaXplZCcpXG4gIHJldHVybiBtYXJrZG93bkl0Lm5vcm1hbGl6ZUxpbmtUZXh0KHVybClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRva2Vucyh0ZXh0OiBzdHJpbmcsIHJMOiBib29sZWFuKSB7XG4gIGlmIChuZWVkc0luaXQockwpKSB7XG4gICAgaW5pdChyTClcbiAgfVxuICByZXR1cm4gbWFya2Rvd25JdCEucGFyc2UodGV4dCwge30pXG59XG4iXX0=