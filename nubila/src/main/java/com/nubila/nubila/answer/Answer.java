package com.nubila.nubila.answer;

import com.nubila.nubila.utils.Common;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Answer extends Common {
	private Long id;
	private Long inqueryId;
	private String content;
	private String writer;
}
