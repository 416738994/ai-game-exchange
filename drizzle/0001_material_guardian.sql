CREATE TABLE `chatMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chatMessages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liquidityPositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`poolName` varchar(50) NOT NULL,
	`chain` varchar(20) NOT NULL,
	`protocol` varchar(30) NOT NULL,
	`token0` varchar(20) NOT NULL,
	`token1` varchar(20) NOT NULL,
	`amount0` decimal(20,8) NOT NULL,
	`amount1` decimal(20,8) NOT NULL,
	`lpTokens` decimal(20,8) NOT NULL,
	`apy` decimal(10,2),
	`totalValue` decimal(20,8),
	`earnedFees` decimal(20,8) DEFAULT '0',
	`impermanentLoss` decimal(20,8),
	`status` enum('active','withdrawn') NOT NULL DEFAULT 'active',
	`addedAt` timestamp NOT NULL DEFAULT (now()),
	`withdrawnAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `liquidityPositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `positions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`symbol` varchar(20) NOT NULL,
	`chain` varchar(20) NOT NULL,
	`type` enum('long','short') NOT NULL,
	`leverage` int NOT NULL,
	`entryPrice` decimal(20,8) NOT NULL,
	`currentPrice` decimal(20,8),
	`amount` decimal(20,8) NOT NULL,
	`collateral` decimal(20,8) NOT NULL,
	`liquidationPrice` decimal(20,8),
	`pnl` decimal(20,8),
	`status` enum('open','closed','liquidated') NOT NULL DEFAULT 'open',
	`openedAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `positions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `trades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`positionId` int,
	`symbol` varchar(20) NOT NULL,
	`chain` varchar(20) NOT NULL,
	`type` enum('long','short') NOT NULL,
	`action` enum('open','close','liquidate') NOT NULL,
	`leverage` int NOT NULL,
	`price` decimal(20,8) NOT NULL,
	`amount` decimal(20,8) NOT NULL,
	`collateral` decimal(20,8) NOT NULL,
	`pnl` decimal(20,8),
	`fee` decimal(20,8),
	`txHash` varchar(66),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `trades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`address` varchar(42) NOT NULL,
	`chain` varchar(20) NOT NULL,
	`isDefault` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`)
);
