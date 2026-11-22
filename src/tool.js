/*! Eretek Online Araçlar #59 — Backup Retention Takvimi */
ERT.def('59', {
	run: function (v, c) {
		var ref = Date.parse(v.date + 'T00:00:00Z');
		if (isNaN(ref)) { throw c.fe('date', 'req'); }
		var D = 86400000, wd = +v.wday, P = {}, order = ['d', 'w', 'm', 'y'];
		var add = function (t, k) { var key = new Date(t).toISOString().slice(0, 10); if (!P[key] || order.indexOf(k) > order.indexOf(P[key])) { P[key] = k; } };
		var i, t, n;
		for (i = 0; i < (v.d || 0); i++) { add(ref - i * D, 'd'); }
		t = ref; while (new Date(t).getUTCDay() !== wd) { t -= D; }
		for (i = 0; i < (v.w || 0); i++) { add(t - i * 7 * D, 'w'); }
		var dt = new Date(ref), y = dt.getUTCFullYear(), m = dt.getUTCMonth();
		for (i = 0; i < (v.m || 0); i++) { add(Date.UTC(y, m - i, 1), 'm'); }
		for (i = 0; i < (v.y || 0); i++) { add(Date.UTC(y - i, 0, 1), 'y'); }
		var keys = Object.keys(P).sort().reverse();
		if (!keys.length) { throw c.fe('d', 'none'); }
		n = { d: 0, w: 0, m: 0, y: 0 }; keys.forEach(function (k) { n[P[k]]++; });
		var rows = keys.map(function (k) { return [k, c.t('t_' + P[k]), c.n(Math.round((ref - Date.parse(k + 'T00:00:00Z')) / D), 0)]; });
		var cols = [c.t('c_date'), c.t('c_type'), c.t('c_age')];
		var msgs = [['info', c.t('rule', { w: c.t('wd' + wd) })], ['info', c.t('dedup')]];
		if (keys.length > 60) { msgs.push(['warn', c.t('many', { n: keys.length })]); }
		return { big: c.t('big', { n: keys.length, o: keys[keys.length - 1] }), kv: [[c.t('t_d'), n.d], [c.t('t_w'), n.w], [c.t('t_m'), n.m], [c.t('t_y'), n.y], [c.t('oldest'), keys[keys.length - 1]]], msgs: msgs, tables: [{ cols: cols, rows: rows }], x: { csv: { name: 'retention', cols: cols, rows: rows } }, v: { count: keys.length, oldest: keys[keys.length - 1] } };
	}
});
