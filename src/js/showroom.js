// 360° showroom: equirectangular panorama in Pannellum (self-hosted,
// js/vendor/pannellum.js — the CSP allows 'self' scripts only).
(function () {
    var el = document.getElementById('showroomViewer');
    if (!el || !window.pannellum) return;
    window.pannellum.viewer(el, {
        type: 'equirectangular',
        panorama: el.getAttribute('data-panorama'),
        preview: el.getAttribute('data-preview'),
        autoLoad: true,
        autoRotate: -2,
        autoRotateInactivityDelay: 4000,
        hfov: 105,
        minHfov: 50,
        maxHfov: 120,
        pitch: -5,
        yaw: 0,
        showControls: true,
        showFullscreenCtrl: true,
        mouseZoom: false,
        compass: false
    });
})();
