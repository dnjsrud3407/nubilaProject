package com.nubila.nubila.inquery;

import com.nubila.nubila.utils.Common;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Inquery extends Common {
	private Long id;
	private String title;
	private String content;
}
