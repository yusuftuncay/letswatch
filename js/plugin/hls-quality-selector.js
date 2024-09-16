!(function (t, e) {
    "object" == typeof exports && "undefined" != typeof module
        ? (module.exports = e(require("video.js")))
        : "function" == typeof define && define.amd
        ? define(["video.js"], e)
        : ((t = "undefined" != typeof globalThis ? globalThis : t || self).videojsHlsQualitySelector = e(t.videojs));
})(this, function (t) {
    "use strict";
    function e(t) {
        return t && "object" == typeof t && "default" in t ? t : { default: t };
    }
    var i = e(t);
    const l = i.default.getComponent("MenuButton"),
        s = i.default.getComponent("Menu"),
        n = i.default.getComponent("Component"),
        o = i.default.dom;
    class u extends l {
        constructor(t) {
            super(t, { title: t.localize("Quality"), name: "QualityButton" });
        }
        createItems() {
            return [];
        }
        createMenu() {
            const t = new s(this.player_, { menuButton: this });
            if (((this.hideThreshold_ = 0), this.options_.title)) {
                const i = o.createEl("li", {
                        className: "vjs-menu-title",
                        innerHTML: ((e = this.options_.title), "string" != typeof e ? e : e.charAt(0).toUpperCase() + e.slice(1)),
                        tabIndex: -1,
                    }),
                    l = new n(this.player_, { el: i });
                (this.hideThreshold_ += 1), t.addItem(l);
            }
            var e;
            if (((this.items = this.createItems()), this.items)) for (let e = 0; e < this.items.length; e++) t.addItem(this.items[e]);
            return t;
        }
    }
    const a = i.default.getComponent("MenuItem");
    class r extends a {
        constructor(t, e, i, l) {
            super(t, { label: e.label, selectable: !0, selected: e.selected || !1 }), (this.item = e), (this.qualityButton = i), (this.plugin = l);
        }
        handleClick() {
            for (let t = 0; t < this.qualityButton.items.length; ++t) this.qualityButton.items[t].selected(!1);
            this.plugin.setQuality(this.item.value), this.selected(!0);
        }
    }
    const h = i.default.getPlugin("plugin"),
        c = {};
    class d extends h {
        constructor(t, e) {
            super(t),
                (this.options = i.default.obj.merge(c, e)),
                this.player.ready(() => {
                    this.player.qualityLevels && (this.player.addClass("vjs-hls-quality-selector"), this.createQualityButton(), this.bindPlayerEvents());
                });
        }
        bindPlayerEvents() {
            this.player.qualityLevels().on("addqualitylevel", this.onAddQualityLevel.bind(this));
        }
        createQualityButton() {
            const t = this.player;
            this._qualityButton = new u(t);
            const e = t.controlBar.children().length - 2,
                i = t.controlBar.addChild(this._qualityButton, { componentClass: "qualitySelector" }, this.options.placementIndex || e);
            if ((i.addClass("vjs-quality-selector"), this.options.displayCurrentQuality)) this.setButtonInnerText(t.localize("Auto"));
            else {
                const t = ` ${this.options.vjsIconClass || "vjs-icon-hd"}`;
                i.menuButton_.$(".vjs-icon-placeholder").className += t;
            }
            i.removeClass("vjs-hidden");
        }
        setButtonInnerText(t) {
            this._qualityButton.menuButton_.$(".vjs-icon-placeholder").innerHTML = t;
        }
        getQualityMenuItem(t) {
            const e = this.player;
            return new r(e, t, this._qualityButton, this);
        }
        onAddQualityLevel() {
            const t = this.player.qualityLevels().levels_ || [],
                e = [];
            for (let i = 0; i < t.length; ++i) {
                const { width: l, height: s } = t[i],
                    n = l > s ? s : l;
                if (n && !e.filter((t) => t.item && t.item.value === n).length) {
                    const t = this.getQualityMenuItem.call(this, { label: n + "p", value: n });
                    e.push(t);
                }
            }
            e.sort((t, e) => ("object" != typeof t || "object" != typeof e || t.item.value < e.item.value ? -1 : t.item.value > e.item.value ? 1 : 0)),
                e.push(this.getQualityMenuItem.call(this, { label: this.player.localize("Auto"), value: "auto", selected: !0 })),
                this._qualityButton && ((this._qualityButton.createItems = () => e), this._qualityButton.update());
        }
        setQuality(t) {
            const e = this.player.qualityLevels();
            (this._currentQuality = t), this.options.displayCurrentQuality && this.setButtonInnerText("auto" === t ? this.player.localize("Auto") : `${t}p`);
            for (let i = 0; i < e.length; ++i) {
                const { width: l, height: s } = e[i],
                    n = l > s ? s : l;
                e[i].enabled = n === t || "auto" === t;
            }
            this._qualityButton.unpressButton();
        }
        getCurrentQuality() {
            return this._currentQuality || "auto";
        }
    }
    return (d.VERSION = "2.0.0"), i.default.registerPlugin("hlsQualitySelector", d), d;
});
