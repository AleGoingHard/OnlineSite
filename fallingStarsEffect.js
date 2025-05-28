document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('rain-container');
  // Colori più vari per le stelle, alcuni più chiari e altri leggermente colorati
  const colors = ['#ffffff', '#f9f9f9', '#f5f5f5', '#f9d46d', '#ffd700', '#ffb84d', '#ff9933', '#f3a683', '#e4e5e9', '#c1c7d0', '#fffacd', '#b0e0e6'];
  const activeDrops = new Set();
  let minDrops, maxDrops;
  let lastCreationTime = 0; // Per evitare flussi di stelle

  function updateDropsCount() {
    const width = window.innerWidth;
    if (width < 600) {
      minDrops = 4;  // Aumentato da 2 a 5
      maxDrops = 8; // Aumentato da 5 a 10
    } else if (width < 1000) {
      minDrops = 5;  // Aumentato da 3 a 7
      maxDrops = 12; // Aumentato da 7 a 14
    } else if (width < 1400) {
      minDrops = 10; // Aumentato da 4 a 9
      maxDrops = 16; // Aumentato da 9 a 18
    } else {
      minDrops = 10; // Aumentato da 5 a 12
      maxDrops = 17; // Aumentato da 11 a 22
    }
  }

  function getRandomAngle() {
    const rand = Math.random();
    
    if (rand < 0.65) {
      // 65% tra π/6 e π/3 (30° e 60°) - Intervallo più comune
      return Math.PI/6 + Math.random() * (Math.PI/6);
    } else if (rand < 0.85) {
      // 20% tra 0 e π/6 (0° e 30°) - Angoli più piatti
      return Math.random() * (Math.PI/6);
    } else {
      // 15% tra π/3 e π/2 (60° e 90°) - Angoli più ripidi
      return Math.PI/3 + Math.random() * (Math.PI/6);
    }
  }

  // Funzione per determinare la posizione iniziale della stella
  function getRandomStartPosition() {
    const screenWidth = window.innerWidth;
    const screenHeight = container.clientHeight || 600;
    
    // Determina il tipo di posizione di partenza con vera casualità
    const positionType = Math.random();
    let startX, startY, angle;
    
    if (positionType < 0.5) {
      // 50% probabilità: apparire dal bordo superiore
      startX = Math.random() * screenWidth;
      startY = -10;
      angle = getRandomAngle(); // Angolo verso il basso
      
      // Aggiustiamo l'angolo per garantire che vada verso destra o sinistra 
      // in base alla posizione orizzontale (effetto naturale di prospettiva)
      if (startX < screenWidth * 0.3) {
        // Zona sinistra dello schermo: tendenza a destra
        angle = Math.min(angle + Math.random() * 0.2, Math.PI/2);
      } else if (startX > screenWidth * 0.7) {
        // Zona destra dello schermo: tendenza a sinistra
        angle = Math.min(Math.PI - angle - Math.random() * 0.2, Math.PI);
      } else {
        // Parte centrale: direzione casuale ma fisica
        angle = Math.random() < 0.5 ? angle : Math.PI - angle;
      }
    } else if (positionType < 0.75) {
      // 25% probabilità: apparire dal bordo sinistro
      startX = -10;
      startY = Math.random() * (screenHeight * 0.6);
      angle = getRandomAngle();
    } else {
      // 25% probabilità: apparire dal bordo destro
      startX = screenWidth + 10;
      startY = Math.random() * (screenHeight * 0.6);
      angle = Math.PI - getRandomAngle();
    }
    
    return { startX, startY, angle };
  }

  function createDrop() {
    const now = Date.now();
    
    // Intervallo leggermente ridotto per una frequenza più naturale
    if (now - lastCreationTime < 120 + Math.random() * 200) {
      return;
    }
    
    if (activeDrops.size >= maxDrops) return;
    
    lastCreationTime = now;
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    
    // Ottieni posizione e angolo iniziale
    const { startX, startY, angle } = getRandomStartPosition();
    
    // Dimensione e velocità della stella cadente - correlate (più grande=più veloce)
    const sizeMultiplier = 0.5 + Math.random() * 1.5;
    const height = 40 + Math.random() * 70 * sizeMultiplier;
    
    // La velocità è correlata all'angolo - angoli più ripidi tendono ad essere più veloci
    const angleSpeedFactor = 1 + Math.abs(Math.sin(angle)) * 1.5;
    const speed = (1.5 + Math.random() * 3) * angleSpeedFactor * sizeMultiplier;
    
    // Selezione colore con bias verso i colori più bianchi/luminosi
    const colorIdx = Math.floor(Math.pow(Math.random(), 1.3) * colors.length);
    const color = colors[colorIdx];
    
    // Durata di vita con distribuzione naturale
    let lifespan;
    const lifespanRand = Math.random();
    
    if (lifespanRand < 0.6) {
      // 60% stelle di durata media: 1-2.5 secondi
      lifespan = 1000 + Math.random() * 1500;
    } else if (lifespanRand < 0.9) {
      // 30% stelle brevi: 0.5-1 secondi
      lifespan = 500 + Math.random() * 500;
    } else {
      // 10% stelle lunghe: 2.5-4 secondi
      lifespan = 2500 + Math.random() * 1500;
    }
    
    drop.style.left = `${startX}px`;
    drop.style.top = `${startY}px`;
    drop.style.height = `${height}px`;
    drop.style.color = color;
    
    // Allineamento con la direzione di movimento
    const rotationDegrees = (angle * (180/Math.PI)) - 90;
    drop.style.transform = `rotate(${rotationDegrees}deg)`;
    
    container.appendChild(drop);
    activeDrops.add(drop);
    
    let posX = startX;
    let posY = startY;
    let opacity = 0;
    let startTime = Date.now();
    
    // Comportamento di luminosità più variato
    const behaviorType = Math.random();
    let pulseRate = 0;
    let flickerChance = 0;
    let brightnessPeak = 0.7 + Math.random() * 0.3; // Luminosità massima variabile
    
    if (behaviorType < 0.5) {
      // 50% comportamento standard (fade in, visibile, fade out)
      pulseRate = 0;
      flickerChance = 0;
    } else if (behaviorType < 0.75) {
      // 25% comportamento pulsante leggero
      pulseRate = 0.2 + Math.random() * 0.6;
      flickerChance = 0;
    } else if (behaviorType < 0.95) {
      // 20% comportamento sfarfallante (flicker)
      pulseRate = 0;
      flickerChance = 0.1 + Math.random() * 0.2;
    } else {
      // 5% comportamento misto (pulsante + flicker occasionale)
      pulseRate = 0.2 + Math.random() * 0.4;
      flickerChance = 0.05 + Math.random() * 0.1;
    }
    
    function animate() {
      const elapsedTime = Date.now() - startTime;
      const lifeProgress = elapsedTime / lifespan;
      
      // Gestione dell'opacità con curve più naturali
      if (lifeProgress < 0.15) {
        // Prime 15%: fade in più veloce all'inizio e poi graduale
        opacity = Math.min(brightnessPeak, (lifeProgress / 0.15) * brightnessPeak);
      } else if (lifeProgress > 0.75) {
        // Ultime 25%: fade out più lungo e graduale
        opacity = Math.max(0, brightnessPeak * (1 - ((lifeProgress - 0.75) / 0.25)));
      } else {
        // Parte centrale: opacità piena o effetti speciali
        opacity = brightnessPeak;
      }
      
      // Applica effetti speciali con curve più naturali
      if (pulseRate > 0) {
        // Effetto pulsazione con sinusoide smussata
        const pulsePhase = Math.sin(elapsedTime * pulseRate / 500);
        // Influenza ridotta per pulsazioni più naturali
        opacity = opacity * (0.85 + pulsePhase * 0.15);
      }
      
      if (flickerChance > 0 && Math.random() < flickerChance) {
        // Effetto flickering più variato
        if (Math.random() < 0.7) {
          // 70% probabilità di diminuire la luminosità
          opacity = opacity * (0.4 + Math.random() * 0.5);
        } else {
          // 30% probabilità di aumentare brevemente la luminosità (flash)
          opacity = Math.min(1, opacity * (1.1 + Math.random() * 0.2));
        }
      }
      
      // Aggiungi piccole variazioni casuale alla velocità per movimento più naturale
      const speedVariation = 1 + (Math.random() * 0.1 - 0.05);
      const dx = Math.cos(angle) * speed * speedVariation;
      const dy = Math.sin(angle) * speed * speedVariation;
      
      posX += dx;
      posY += dy;
      
      drop.style.left = `${posX}px`;
      drop.style.top = `${posY}px`;
      drop.style.opacity = opacity;
      
      // Calcola dimensioni schermo dinamicamente
      const screenWidth = window.innerWidth;
      const screenHeight = container.clientHeight || 600;
      
      // Condizioni di fine animazione più precise
      if (lifeProgress >= 1 || 
          posY > screenHeight + 50 || 
          posX < -100 || 
          posX > screenWidth + 100) {
          
        drop.remove();
        activeDrops.delete(drop);
        
        // Valuta la creazione di nuove stelle con più frequenza ma naturale
        if (activeDrops.size < minDrops) {
          setTimeout(createDrop, 80 + Math.random() * 300);
        }
      } else {
        requestAnimationFrame(animate);
      }
    }
    
    requestAnimationFrame(animate);
  }

  // Inizializzazione con tempi più naturali
  updateDropsCount();
  
  // Creazione iniziale con intervalli più naturali
  for (let i = 0; i < minDrops; i++) {
    setTimeout(createDrop, 150 + i * (200 + Math.random() * 400));
  }

  // Creazione periodica con frequenza leggermente aumentata
  setInterval(() => {
    // Probabilità aumentata ma non eccessiva di creare nuove stelle
    if (activeDrops.size < maxDrops && Math.random() > 0.3) {
      setTimeout(createDrop, Math.random() * 300);
    }
  }, 900); // Intervallo ridotto da 1200 a 900ms

  // Funzione aggiuntiva per garantire un flusso minimo di stelle
  setInterval(() => {
    const currentStarDeficit = minDrops - activeDrops.size;
    if (currentStarDeficit > 0) {
      for (let i = 0; i < Math.min(currentStarDeficit, 3); i++) {
        setTimeout(createDrop, i * 200);
      }
    }
  }, 1500);

  // Gestione del ridimensionamento della finestra
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateDropsCount();
      
      // Adatta il numero di stelle alla nuova dimensione
      if (activeDrops.size > maxDrops) {
        const excess = Array.from(activeDrops).slice(0, activeDrops.size - maxDrops);
        excess.forEach(drop => {
          drop.remove();
          activeDrops.delete(drop);
        });
      }
      
      if (activeDrops.size < minDrops) {
        for (let i = 0; i < minDrops - activeDrops.size; i++) {
          setTimeout(createDrop, i * 250 + Math.random() * 200);
        }
      }
    }, 200);
  });
});