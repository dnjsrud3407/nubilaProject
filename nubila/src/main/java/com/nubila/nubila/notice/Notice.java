package com.nubila.nubila.notice;

import com.nubila.nubila.utils.Common;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class Notice extends Common {
	private Long id;
	private String title;
	private String content;
}
