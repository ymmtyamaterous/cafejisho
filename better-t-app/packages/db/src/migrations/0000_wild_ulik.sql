CREATE TABLE `quiz` (
	`id` text PRIMARY KEY NOT NULL,
	`lesson_id` text NOT NULL,
	`title` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_lesson_id_idx` ON `quiz` (`lesson_id`);--> statement-breakpoint
CREATE TABLE `quiz_choice` (
	`id` text PRIMARY KEY NOT NULL,
	`question_id` text NOT NULL,
	`text` text NOT NULL,
	`is_correct` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`question_id`) REFERENCES `quiz_question`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_choice_question_id_idx` ON `quiz_choice` (`question_id`);--> statement-breakpoint
CREATE TABLE `quiz_question` (
	`id` text PRIMARY KEY NOT NULL,
	`quiz_id` text NOT NULL,
	`text` text NOT NULL,
	`explanation` text DEFAULT '' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_question_quiz_id_idx` ON `quiz_question` (`quiz_id`);--> statement-breakpoint
CREATE TABLE `origin` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_en` text NOT NULL,
	`continent` text NOT NULL,
	`country_code` text NOT NULL,
	`flavor_tags` text DEFAULT '[]' NOT NULL,
	`altitude` text DEFAULT '' NOT NULL,
	`annual_production` text DEFAULT '' NOT NULL,
	`varieties` text DEFAULT '[]' NOT NULL,
	`processing_methods` text DEFAULT '[]' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`thumbnail_emoji` text DEFAULT '🌍' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `origin_continent_idx` ON `origin` (`continent`);--> statement-breakpoint
CREATE TABLE `glossary_term` (
	`id` text PRIMARY KEY NOT NULL,
	`term` text NOT NULL,
	`reading` text DEFAULT '' NOT NULL,
	`term_en` text DEFAULT '' NOT NULL,
	`category` text NOT NULL,
	`short_description` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`related_term_ids` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `glossary_term_category_idx` ON `glossary_term` (`category`);--> statement-breakpoint
CREATE TABLE `bookmark` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`target_id` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `bookmark_user_id_idx` ON `bookmark` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `bookmark_user_type_target_unique` ON `bookmark` (`user_id`,`type`,`target_id`);--> statement-breakpoint
CREATE TABLE `lesson_completion` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`lesson_id` text NOT NULL,
	`completed_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lesson_id`) REFERENCES `lesson`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lesson_completion_user_id_idx` ON `lesson_completion` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `lesson_completion_user_lesson_unique` ON `lesson_completion` (`user_id`,`lesson_id`);--> statement-breakpoint
CREATE TABLE `quiz_result` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`quiz_id` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`attempted_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`quiz_id`) REFERENCES `quiz`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `quiz_result_user_id_idx` ON `quiz_result` (`user_id`);--> statement-breakpoint
CREATE TABLE `user_premium` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`started_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`expires_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_premium_user_id_unique` ON `user_premium` (`user_id`);--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
CREATE TABLE `course` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`level` text NOT NULL,
	`duration_minutes` integer DEFAULT 0 NOT NULL,
	`thumbnail_emoji` text DEFAULT '☕' NOT NULL,
	`is_premium` integer DEFAULT false NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lesson` (
	`id` text PRIMARY KEY NOT NULL,
	`course_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`order_index` integer DEFAULT 0 NOT NULL,
	`duration_minutes` integer DEFAULT 0 NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	FOREIGN KEY (`course_id`) REFERENCES `course`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `lesson_course_id_idx` ON `lesson` (`course_id`);