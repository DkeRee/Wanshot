import java.awt.*;

public class WanshotScorekeeper {
	private final int menuWidth = 700;
	private final int menuHeight = 600;
	private int menuX = (WanshotModel.WIDTH - this.menuWidth) / 2;
	private int menuY = -1507;
	private boolean droppingDown = true;
	private boolean slidingUp = false;
	private int droppingVelocity = 78;
	private boolean resetFlag = false;
	
	private Color menuBorderColor = Color.decode("#FFC97A");
	private Color menuColor = Color.decode("#FFDFA8");
	
	private final int brownTank = 1;
	private final int greyTank = 2;
	private final int yellowTank = 3;
	private final int tealTank = 4;
	private final int pinkTank = 5;
	private final int whiteTank = 6;
	private final int purpleTank = 7;
	private final int greenTank = 8;
	private final int blackTank = 9;
	private int totalScore = 0;
	
	private int brownTanksKilled = 0;
	private int greyTanksKilled = 0;
	private int yellowTanksKilled = 0;
	private int tealTanksKilled = 0;
	private int pinkTanksKilled = 0;
	private int whiteTanksKilled = 0;
	private int purpleTanksKilled = 0;
	private int blackTanksKilled = 0;
	private int greenTanksKilled = 0;
	
	public boolean shouldUpdate() {
		//halt updating in update loop if player is still alive
		return !WanshotModel.isPlayerAlive();
	}
	
	public void reset() {
		this.brownTanksKilled = 0;
		this.greyTanksKilled = 0;
		this.yellowTanksKilled = 0;
		this.tealTanksKilled = 0;
		this.pinkTanksKilled = 0;
		this.whiteTanksKilled = 0;
		this.purpleTanksKilled = 0;
		this.greenTanksKilled = 0;
		this.blackTanksKilled = 0;
		this.totalScore = 0;
		this.menuY = -1507;
		this.droppingDown = true;
		this.slidingUp = false;
		this.droppingVelocity = 78;
	}
	
	public void update() {		
		if (this.droppingDown) {
			this.menuY += this.droppingVelocity;
			this.droppingVelocity -= 2;
						
			if (this.droppingVelocity <= 0) {
				this.droppingDown = false;
			}
			
			return;
		}
		
		if (this.slidingUp) {
			this.menuY -= this.droppingVelocity;
			this.droppingVelocity += 2;
			
			if (this.droppingVelocity >= 78) {
				this.slidingUp = false;
				this.resetFlag = true;
				this.reset();
			}
		}
	}
	
	public void updateKills(TankCache[] caches) {
		for (int i = 0; i < caches.length; i++) {
			switch (caches[i].getType()) {
				case BrownTank:
					this.brownTanksKilled++;
					this.totalScore += this.brownTank;
					break;
				case GreyTank:
					this.greyTanksKilled++;
					this.totalScore += this.greyTank;
					break;
				case YellowTank:
					this.yellowTanksKilled++;
					this.totalScore += this.yellowTank;
					break;
				case TealTank:
					this.tealTanksKilled++;
					this.totalScore += this.tealTank;
					break;
				case PinkTank:
					this.pinkTanksKilled++;
					this.totalScore += this.pinkTank;
					break;
				case WhiteTank:
					this.whiteTanksKilled++;
					this.totalScore += this.whiteTank;
					break;
				case PurpleTank:
					this.purpleTanksKilled++;
					this.totalScore += this.purpleTank;
					break;
				case GreenTank:
					this.greenTanksKilled++;
					this.totalScore += this.greenTank;
					break;
				case BlackTank:
					this.blackTanksKilled++;
					this.totalScore += this.blackTank;
					break;
			}
		}
	}
	
	public void render(Graphics2D ctx) {
		Rectangle menu = new Rectangle(this.menuX, this.menuY, this.menuWidth, this.menuHeight);
		
		ctx.setStroke(new BasicStroke(10));
		ctx.setColor(this.menuBorderColor);
		ctx.draw(menu);
		
		ctx.setColor(this.menuColor);
		ctx.fill(menu);
		
	    Font font = new Font("monospace", Font.BOLD, 80);
	    ctx.setFont(font);
	    ctx.setColor(Color.decode("#ffaa2e"));
		ctx.drawString("WANSHOT", this.menuX + 150, this.menuY + 110);
	
	    font = new Font("monospace", Font.BOLD, 40);
	    ctx.setFont(font);
		
	    Rectangle brown = new Rectangle(this.menuX + 190, this.menuY + 160, 35, 30);
		ctx.setColor(BrownTank.color);
		
		ctx.drawString("x " + this.brownTanksKilled, this.menuX + 250, this.menuY + 185);
		ctx.fill(brown);
		
		Rectangle grey = new Rectangle(this.menuX + 190, this.menuY + 200, 35, 30);
		ctx.setColor(GreyTank.color);
		
		ctx.drawString("x " + this.greyTanksKilled, this.menuX + 250, this.menuY + 225);
		ctx.fill(grey);
		
		Rectangle yellow = new Rectangle(this.menuX + 190, this.menuY + 240, 35, 30);
		ctx.setColor(YellowTank.color);
		
		ctx.drawString("x " + this.yellowTanksKilled, this.menuX + 250, this.menuY + 265);
		ctx.fill(yellow);
		
		Rectangle teal = new Rectangle(this.menuX + 190, this.menuY + 280, 35, 30);
		ctx.setColor(TealTank.color);
		
		ctx.drawString("x " + this.tealTanksKilled, this.menuX + 250, this.menuY + 305);
		ctx.fill(teal);
		
		Rectangle pink = new Rectangle(this.menuX + 190, this.menuY + 320, 35, 30);
		ctx.setColor(PinkTank.color);
		
		ctx.drawString("x " + this.pinkTanksKilled, this.menuX + 250, this.menuY + 345);
		ctx.fill(pink);
		
		Rectangle white = new Rectangle(this.menuX + 190, this.menuY + 360, 35, 30);
		ctx.setColor(WhiteTank.color);
		
		ctx.drawString("x " + this.whiteTanksKilled, this.menuX + 250, this.menuY + 385);
		ctx.fill(white);
		
		Rectangle purple = new Rectangle(this.menuX + 190, this.menuY + 400, 35, 30);
		ctx.setColor(PurpleTank.color);
		
		ctx.drawString("x " + this.purpleTanksKilled, this.menuX + 250, this.menuY + 425);
		ctx.fill(purple);
		
		Rectangle green = new Rectangle(this.menuX + 190, this.menuY + 440, 35, 30);
		ctx.setColor(GreenTank.color);
		
		ctx.drawString("x " + this.greenTanksKilled, this.menuX + 250, this.menuY + 465);
		ctx.fill(green);
		
		Rectangle black = new Rectangle(this.menuX + 190, this.menuY + 480, 35, 30);
		ctx.setColor(BlackTank.color);
		
		ctx.drawString("x " + this.blackTanksKilled, this.menuX + 250, this.menuY + 505);
		ctx.fill(black);
		
	    font = new Font("monospace", Font.PLAIN, 50);
	    ctx.setFont(font);
	    ctx.setColor(Color.decode("#ffaa2e"));
		ctx.drawString("PRESS", this.menuX + 355, this.menuY + 300);
		ctx.drawString("ENTER", this.menuX + 355, this.menuY + 380);
		
		ctx.drawString("Total Score: " + this.totalScore, this.menuX + 200, this.menuY + 580);
	}
	
	public void startGame() {
		if (this.shouldUpdate() && !this.slidingUp) {
			this.slidingUp = true;
			WanshotMain.playSound("closePause.wav");
		}
	}
	
	public boolean getResetFlag() {
		return this.resetFlag;
	}
	
	public void resetFlagFalsify() {
		this.resetFlag = false;
	}
}