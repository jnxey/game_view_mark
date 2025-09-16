import { getWindowSize } from '@/tools';
import { onMounted } from 'vue';

export function useYanhua(id) {
  const result = { start: null, close: null };
  const getAnimate = () => {
    const canvas = document.getElementById(id);
    const ctx = canvas.getContext('2d');

    canvas.width = getWindowSize().width;
    canvas.height = getWindowSize().height;

    class Firework {
      constructor(x, y, color, count) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.count = count;
        this.particles = [];
        this.exploded = false;
        this.timer = 0;
      }

      update() {
        if (this.exploded) {
          this.particles.forEach((p, index) => {
            p.update();
            if (p.life <= 0 && p.radius <= 0) {
              this.particles.splice(index, 1); // 移除已消失的粒子
            }
          });
        } else {
          this.timer++;
          if (this.timer > 50) {
            this.explode();
          } else {
            this.y -= 5; // Rocket moving upwards
          }
        }
      }

      explode() {
        this.exploded = true;
        for (let i = 0; i < this.count; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const speed = Math.random() * 3 + 3;
          this.particles.push(new Particle(this.x, this.y, angle, speed, this.color));
        }
      }

      draw() {
        if (this.exploded) {
          this.particles.forEach((p) => p.draw());
        } else {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        }
      }

      isDead() {
        return this.exploded && this.particles.length === 0;
      }
    }

    class Particle {
      constructor(x, y, angle, speed, color) {
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.color = color;
        this.life = 100; // Particle life span
        this.radius = Math.random() * 2 + 2;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life--;

        if (this.life <= 0) {
          this.radius -= 0.1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    function randomColor() {
      const colors = ['#ff0044', '#ff8800', '#ffdd00', '#44ff00', '#00ff88', '#00bbff', '#6600ff'];
      return colors[Math.floor(Math.random() * colors.length)];
    }

    function createFirework() {
      const x = Math.random() * canvas.width;
      const y = canvas.height - 50;
      const color = randomColor();
      const count = 100 + Math.floor(Math.random() * 100);
      fireworks.push(new Firework(x, y, color, count));
    }

    const fireworks = [];

    let timerFrame;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.02) {
        createFirework();
      }

      // 更新和绘制烟花
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();

        // 移除已经消失的烟花
        if (fireworks[i].isDead()) {
          fireworks.splice(i, 1);
        }
      }

      if (timerFrame) requestAnimationFrame(animate);
    }

    function start() {
      timerFrame = true;
      animate();
    }

    function close() {
      timerFrame = false;
    }

    return { start, close };
  };

  onMounted(() => {
    const { start, close } = getAnimate();
    result.start = start;
    result.close = close;
  });

  return result;
}
