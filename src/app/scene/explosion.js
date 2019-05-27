import anime from '../util/anime.es';

const explosion = (() => {
  let canvasEl;
  let ctx;
  let render;
  let colors = ['#FF1461', '#18FF92', '#5A87FF', '#FBF38C'];
  const numberOfParticules = 35;
  const init = (canvas) => {
    console.log('hello');
    canvasEl = canvas;
    ctx = canvasEl.getContext('2d');
    setCanvasSize();
    render = anime({
        duration: Infinity,
        update: () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      })
  };

  const setCanvasSize = () => {
    canvasEl.width = 1440 * 2
    canvasEl.height = 700 * 2
    canvasEl.style.width = 1440 + 'px'
    canvasEl.style.height = 700 + 'px'
    canvasEl.getContext('2d').scale(2, 2)
  };

  const setParticuleDirection =  (p) => {
    let angle = anime.random(0, 360) * Math.PI / 180
    let value = anime.random(50, 180)
    let radius = [-1, 1][anime.random(0, 1)] * value
    return {
      x: p.x + radius * Math.cos(angle),
      y: p.y + radius * Math.sin(angle)
    }
  };

  const createParticule = (x, y) => {
    let p = {}
    p.x = x
    p.y = y
    p.color = colors[anime.random(0, colors.length - 1)]
    p.radius = anime.random(16, 32)
    p.endPos = setParticuleDirection(p)
    p.draw = () => {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.fillStyle = p.color
      ctx.fill()
    }
    return p
  };

  const createCircle = (x, y) => {
    var p = {}
    p.x = x
    p.y = y
    p.color = '#FFF'
    p.radius = 0.1
    p.alpha = 0.5
    p.lineWidth = 6
    p.draw = () => {
      ctx.globalAlpha = p.alpha
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
      ctx.lineWidth = p.lineWidth
      ctx.strokeStyle = p.color
      ctx.stroke()
      ctx.globalAlpha = 1
    }
    return p
  };

  const renderParticule = (anim) => {
    for (let i = 0; i < anim.animatables.length; i++) {
      anim.animatables[i].target.draw()
    }
  }

  const animateParticules = (x, y) => {
    var circle = createCircle(x, y)
    var particules = []
    for (var i = 0; i < numberOfParticules; i++) {
      particules.push(createParticule(x, y))
    }
    anime.timeline().add({
      targets: particules,
      x: function (p) { return p.endPos.x },
      y: function (p) { return p.endPos.y },
      radius: 0.1,
      duration: anime.random(1200, 1800),
      easing: 'easeOutExpo',
      update: renderParticule
    })
      // .add({
      //   targets: circle,
      //   radius: anime.random(80, 160),
      //   lineWidth: 0,
      //   alpha: {
      //     value: 0,
      //     easing: 'linear',
      //     duration: anime.random(600, 800)
      //   },
      //   duration: anime.random(1200, 1800),
      //   easing: 'easeOutExpo',
      //   update: renderParticule,
      //   offset: 0
      // })
  }

  const clickThis = (pointerX, pointerY) => {
    render.play()
    animateParticules(pointerX, pointerY)
  }

  return {
    init,
    clickThis
  }
})();

export default explosion;