import java.awt.*;

enum TankTypes {
	BrownTank,
	GreyTank,
	YellowTank,
	TealTank,
	PinkTank,
	WhiteTank,
	PurpleTank,
	GreenTank,
	BlackTank
}

class SpawnParticle extends Particle {
	static final int side = 80;
	int x;
	int y;
	int opacity = 200;
	int speed = 400;
	double angle = WanshotModel.degreesToRadians(Math.random() * 360);
	Color color;
	
	public SpawnParticle(int x, int y, Color color) {
		this.x = x;
		this.y = y;
		this.color = color;
	}
	
	public void update() {
		this.x += this.speed * Math.cos(this.angle) * WanshotModel.deltaTime;
		this.y += this.speed * Math.sin(this.angle) * WanshotModel.deltaTime;
		this.opacity -= 200 * WanshotModel.deltaTime;
		
		this.speed -= WanshotModel.deltaTime;
		
		this.angle += WanshotModel.degreesToRadians(5);
		this.angle %= 2 * Math.PI;
		
		if (this.opacity <= 0) {
			super.delete = true;
			return;
		}
		
		this.color = new Color(this.color.getRed(), this.color.getGreen(), this.color.getBlue(), this.opacity);
	}
	
	public void render(Graphics2D ctx) {
		ctx.rotate(this.angle, this.x + SpawnParticle.side / 2, this.y + SpawnParticle.side / 2);
		ctx.setColor(this.color);
		
		Rectangle p = new Rectangle(this.x, this.y, SpawnParticle.side, SpawnParticle.side);
		ctx.draw(p);
		ctx.fill(p);
		
		ctx.setTransform(WanshotView.oldTransform);
	}
}

class TankCache {
	private TankTypes type;
	private Point coords;
	
	public TankCache(TankTypes type, Point coords) {
		this.type = type;
		this.coords = coords;
	}
	
	public void createSpawnParticles() {
		int centerX = ((int)this.coords.x + Tank.WIDTH / 2) + 14;
		int centerY = ((int)this.coords.y + Tank.HEIGHT / 2) + 14;
		Color color = null;
		
		switch (this.type) {
			case BrownTank:
				color = BrownTank.color;
				break;
			case GreyTank:
				color = GreyTank.color;
				break;
			case YellowTank:
				color = YellowTank.color;
				break;
			case TealTank:
				color = TealTank.color;
				break;
			case PinkTank:
				color = PinkTank.color;
				break;
			case WhiteTank:
				color = WhiteTank.color;
				break;
			case PurpleTank:
				color = PurpleTank.color;
				break;
			case GreenTank:
				color = GreenTank.color;
				break;
			case BlackTank:
				color = BlackTank.color;
				break;
		}
		
		for (int i = 0; i < 5; i++) {
			SpawnParticle p = new SpawnParticle(centerX - SpawnParticle.side / 2, centerY - SpawnParticle.side / 2, color);
			WanshotModel.particles.add(p);
		}
	}
	
	public TankTypes getType() {
		return this.type;
	}
	
	public Point getCoords() {
		return this.coords;
	}
}

public class WanshotManager {
	private WanshotScorekeeper scoreKeeper;
	private int level = 0;
	private int waveCap = 5;
	private int wave = 0;
	private int enemiesCap = 5;
	private boolean unloading = false;
	private int unloadCounter = 0;
	private int unloadSpeed;
	private int loaderInd = 0;
	private int distImmunity = 430;
	private TankCache[][] levelList;
	private TankCache[] prevWave;
	private TankTypes[] tanksToChoose = null;
	
	public WanshotManager(WanshotScorekeeper scoreKeeper) {
		this.updateTankChooser();
		this.scoreKeeper = scoreKeeper;
		this.levelList = this.populateLevelList();
	}
		
	public TankCache[][] populateLevelList() {
		TankCache[][] list = new TankCache[this.getMaxWaves()][0];
		
		for (int i = 0; i < list.length; i++) {
			TankCache[] currWave = new TankCache[this.getMaxWaveEnemies(i)];
			
			for (int j = 0; j < currWave.length; j++) {
				currWave[j] = this.createTank();
			}
			
			list[i] = currWave;
		}
		
		return list;
	}
	
	public void updateTankChooser() {
		if (this.level < 3) {
			tanksToChoose = new TankTypes[1];
			tanksToChoose[0] = TankTypes.BrownTank;
		} else if (this.level <= 3) {
			tanksToChoose = new TankTypes[2];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
		} else if (this.level <= 5) {
			tanksToChoose = new TankTypes[3];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
		} else if (this.level <= 6) {
			tanksToChoose = new TankTypes[4];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
		} else if (this.level <= 7) {
			tanksToChoose = new TankTypes[5];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
			tanksToChoose[4] = TankTypes.PinkTank;
		} else if (this.level <= 8) {
			tanksToChoose = new TankTypes[6];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
			tanksToChoose[4] = TankTypes.PinkTank;
			tanksToChoose[5] = TankTypes.WhiteTank;
		} else if (this.level <= 9) {
			tanksToChoose = new TankTypes[7];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
			tanksToChoose[4] = TankTypes.PinkTank;
			tanksToChoose[5] = TankTypes.WhiteTank;
			tanksToChoose[6] = TankTypes.PurpleTank;
		} else if (this.level <= 10) {
			tanksToChoose = new TankTypes[8];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
			tanksToChoose[4] = TankTypes.PinkTank;
			tanksToChoose[5] = TankTypes.WhiteTank;
			tanksToChoose[6] = TankTypes.PurpleTank;
			tanksToChoose[7] = TankTypes.GreenTank;	
		} else {
			tanksToChoose = new TankTypes[9];
			tanksToChoose[0] = TankTypes.BrownTank;
			tanksToChoose[1] = TankTypes.GreyTank;
			tanksToChoose[2] = TankTypes.YellowTank;
			tanksToChoose[3] = TankTypes.TealTank;
			tanksToChoose[4] = TankTypes.PinkTank;
			tanksToChoose[5] = TankTypes.WhiteTank;
			tanksToChoose[6] = TankTypes.PurpleTank;
			tanksToChoose[7] = TankTypes.GreenTank;
			tanksToChoose[8] = TankTypes.BlackTank;
		}
	}
	
	public void update() {
		if (WanshotModel.isPlayerAlive()) {
			if (WanshotModel.onlyPlayerAlive() && !this.unloading) {
				//update score by end of each wave						
				if (this.prevWave != null) {
					this.scoreKeeper.updateKills(this.prevWave);
				}
				
				this.prevWave = this.levelList[this.wave].clone();
				this.unloading = true;
				this.unloadSpeed = this.getUnloadSpeed();
				
				this.updateTankChooser();
				
				WanshotMain.playSound("newRound.wav");
			}
			
			if (this.unloading) {
				if (this.unloadCounter < 0) {
					this.unloadCounter++;
				} else {
					this.unloadCounter = this.unloadSpeed;
					
					TankCache[] levelWave = this.levelList[this.wave];
					
					//upload tank and do all the specifics
					TankCache cache = levelWave[this.loaderInd];
					
					//upload tank cache into game
					this.readTankCache(cache);
					this.loaderInd++;
					
					//we have reached the end of this wave, go onto the next wave and move onto the next wave once player clears this one
					if (this.loaderInd == levelWave.length) {
						this.wave++;
						this.unloading = false;
						this.loaderInd = 0;						
					}
					
					//we have reached the end of this level, go onto the next level
					if (this.wave == this.levelList.length) {
						this.wave = 0;
						this.level++;
						this.levelList = this.populateLevelList();
					}
				}
			}	
		}
	}
	
	public TankCache createTank() {
		//creates tank based off of current level
		Point randomPoint = this.getRandomCoords();
		
		return new TankCache(this.tanksToChoose[(int)(Math.random() * this.tanksToChoose.length)], randomPoint);
	}
	
	public void readTankCache(TankCache cache) {
		Tank tank = null;
		Point coords = cache.getCoords();
		
		switch (cache.getType()) {
			case BrownTank:
				tank = new BrownTank((int)coords.x, (int)coords.y);
				break;
			case GreyTank:
				tank = new GreyTank((int)coords.x, (int)coords.y);
				break;
			case YellowTank:
				tank = new YellowTank((int)coords.x, (int)coords.y);
				break;
			case TealTank:
				tank = new TealTank((int)coords.x, (int)coords.y);
				break;
			case PinkTank:
				tank = new PinkTank((int)coords.x, (int)coords.y);
				break;
			case WhiteTank:
				tank = new WhiteTank((int)coords.x, (int)coords.y);
				WanshotMain.playSound("superpower.wav");
				break;
			case PurpleTank:
				tank = new PurpleTank((int)coords.x, (int)coords.y);
				break;
			case GreenTank:
				tank = new GreenTank((int)coords.x, (int)coords.y);
				break;
			case BlackTank:
				tank = new BlackTank((int)coords.x, (int)coords.y);
		}
		
		cache.createSpawnParticles();
		WanshotModel.tanks.add(tank);
		
		WanshotMain.playSound("tankSpawn.wav");
	}
	
	public int getUnloadSpeed() {
		int unloadSpeedThreshold = 20;
		return Math.min(-((unloadSpeedThreshold - this.level)), -40);
	}
	
	public Point getRandomCoords() {
		Tank player = WanshotModel.tanks.get(0);
		
		int offset = 100;
		Point randomPoint = null;
		
		while (randomPoint == null || Parallelogram.getMagnitude(new Point(player.centerX - randomPoint.x, player.centerY - randomPoint.y)) < this.distImmunity) {
			randomPoint = new Point((int)(Math.random() * (WanshotModel.WIDTH - offset)) + 20, (int)(Math.random() * (WanshotModel.HEIGHT - offset)) + 20);
		}
		
		return randomPoint;
	}
	
	public int getMaxWaves() {
		int waveMin = 1;
		
		if (this.level > 5) {
			waveMin = 3;
		}
		
		return Math.min(((int)(Math.random() * this.level) - (waveMin - 1)) + waveMin, this.waveCap);
	}
	
	public int getMaxWaveEnemies(int waveCount) {
		int enemyMin = 1;
		int levelOffset = (this.level) + (waveCount);
		
		if (this.level > 5) {
			enemyMin = 3;
		}
		
		return Math.min(((int)(Math.random() * levelOffset) - (enemyMin - 1)) + enemyMin, this.enemiesCap);
	}
	
	public int getLevel() {
		return this.level;
	}
	
	public int getWave() {
		return this.wave + 1;
	}
	
	public int getMaxWave() {
		return this.levelList.length;
	}
}