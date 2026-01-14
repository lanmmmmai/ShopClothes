import React, {useState} from "react";

import { useNavigate } from "react-router-dom";
export default (props) => {
	const [input1, onChangeInput1] = useState('');
	const navigate = useNavigate();
	return (
		<div className="min-h-screen w-full bg-black overflow-x-hidden">
			<div className="flex min-h-screen w-full bg-black">
				<div className="flex w-full min-h-screen items-stretch">
					<div className="flex flex-col shrink-0 w-72 items-start bg-black p-5 gap-5">
						<div className="flex items-center px-[26px] gap-2.5">
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/n4flwp0i_expires_30_days.png"} 
								className="w-8 h-8 object-fill"
							/>
							<span className="text-white text-xl font-bold" >
								{"Clothes"}
							</span>
						</div>
						<div className="flex flex-col items-start gap-5">
							<div className="flex flex-col items-start">
								<div className="flex flex-col items-start py-[17px] px-1.5 w-full">
									<span className="text-white text-xs" >
										{"DISCOVER"}
									</span>
								</div>
								<div className="flex items-start bg-black py-2 px-1.5 mr-3 gap-2.5 rounded-[10px]">
									<img
										src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/gbn00lx1_expires_30_days.png"} 
										className="w-6 h-6 rounded-[10px] object-fill"
									/>
									<span className="text-white text-base" >
										{"Trang Chủ"}
									</span>
									<div className="w-6 h-6">
									</div>
								</div>
							</div>
							<div className="flex flex-col items-start gap-2.5">
								<div className="flex flex-col items-start px-1.5 w-full">
									<span className="text-white text-xs" >
										{"HÀNG TỒN KHO"}
									</span>
								</div>
								<div className="flex flex-col items-start pb-[131px]">
									<div className="flex items-start bg-black py-2 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/products")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/88plq3t3_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5" >
											{"Các Sản Phẩm"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/report")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/igsjjb7u_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[67px]" >
											{"Báo Cáo"}
										</span>
									</div>
									<div className="flex items-start py-2 mb-2.5 rounded-lg cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/schedule")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/0uujsxzf_expires_30_days.png"} 
											className="w-6 h-6 ml-1.5 mr-2.5 rounded-lg object-fill"
										/>
										<span className="text-white text-base mr-[62px]" >
											{"Lịch Trình"}
										</span>
									</div>
									<div className="flex items-start bg-black py-2 px-1.5 mb-2.5 gap-2.5 rounded-[10px] cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/customers")}>
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/ekjcbytk_expires_30_days.png"} 
											className="w-6 h-6 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base" >
											{"Khách Hàng"}
										</span>
										<div className="w-6 h-6 cursor-pointer" role="button" tabIndex={0} onClick={()=>navigate("/settings")}>
										</div>
									</div>
									<div className="flex items-center bg-black mb-[131px] rounded-[10px]">
										<img
											src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/akrnl0m7_expires_30_days.png"} 
											className="w-[22px] h-[22px] ml-1.5 mr-2.5 rounded-[10px] object-fill"
										/>
										<span className="text-white text-base mr-5">{"Cài Đặt"}</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex items-center pt-[260px]">
							<div className="flex shrink-0 items-center gap-2.5">
								<img
									src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/j6j98rw0_expires_30_days.png"} 
									className="w-10 h-10 object-fill"
								/>
								<div className="flex flex-col shrink-0 items-start gap-0.5">
									<span className="text-white text-[11px] font-bold" >
										{"Lương Đức Thành"}
									</span>
									<span className="text-[#757575] text-xs mr-[52px]" >
										{"Thu ngân"}
									</span>
								</div>
							</div>
							<img
								src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/w22kqgc2_expires_30_days.png"} 
								className="w-5 h-5 object-fill"
							/>
						</div>
					</div>
					<div className="flex flex-1 flex-col bg-neutral-100 m-5 p-5 gap-5 rounded-2xl">
						<div className="flex justify-between items-start self-stretch">
							<span className="text-black text-2xl font-bold" >
								{"Báo cáo"}
							</span>
							<div className="flex shrink-0 items-start gap-[3px]">
								<button className="flex flex-col shrink-0 items-start bg-white text-left py-1.5 px-3 rounded-md border border-solid border-black"
									onClick={()=>alert("Pressed!")}>
									<span className="text-black text-base" >
										{"Nhập khẩu"}
									</span>
								</button>
								<button className="flex flex-col shrink-0 items-start bg-black text-left py-1.5 px-3 rounded-md border-0"
									onClick={()=>alert("Pressed!")}>
									<span className="text-white text-base" >
										{"Thêm sản phẩm"}
									</span>
								</button>
							</div>
						</div>
						<div className="flex items-start self-stretch bg-[#F3F5F9] pb-[21px] px-5 gap-3 rounded-2xl">
							<div className="flex flex-col shrink-0 items-start bg-white py-2.5 px-3 rounded-[10px]">
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[37px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Báo cáo cuối ngày"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[39px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Báo cáo bán hàng"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[39px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Báo cáo hàng hóa"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-[21px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Báo cáo khách hàng"}
									</span>
								</div>
								<div className="flex flex-col items-start py-2.5 pl-2.5 pr-10 rounded-[10px]">
									<span className="text-black text-base w-36" >
										{"Báo cáo nhà cung cấp"}
									</span>
								</div>
								<div className="flex flex-col items-start bg-[#7676801C] py-2.5 pl-2.5 pr-[34px] rounded-[10px]">
									<span className="text-black text-base" >
										{"Báo cáo doanh thu"}
									</span>
								</div>
							</div>
							<div className="flex flex-1 flex-col items-start rounded-[10px]">
								<div className="flex items-start">
									<button className="flex flex-col shrink-0 items-start bg-white text-left py-2.5 px-7 rounded-tl-[10px] border-0"
										onClick={()=>alert("Pressed!")}>
										<span className="text-black text-sm" >
											{"Biểu đồ"}
										</span>
									</button>
									<button className="flex flex-col shrink-0 items-start bg-[#7676801C] text-left p-2.5 rounded-tr-[10px] border-0"
										onClick={()=>alert("Pressed!")}>
										<span className="text-black text-sm" >
											{"Báo cáo"}
										</span>
									</button>
								</div>
								<div className="self-stretch bg-white pt-3 px-3 rounded-br-[10px] rounded-bl-[10px]">
									<div className="flex items-start self-stretch mb-[18px]">
										<div className="flex flex-1 flex-col bg-white p-3 mr-2.5 gap-1.5 rounded-[10px] border border-solid border-[#8C8C8C]">
											<div className="flex items-start self-stretch gap-[11px]">
												<span className="text-black text-sm" >
													{"Tổng doanh thu"}
												</span>
												<span className="text-black text-sm" >
													{"2020-2022"}
												</span>
											</div>
											<div className="flex items-center self-stretch gap-[31px]">
												<span className="text-black text-2xl font-bold" >
													{"4,668"}
												</span>
												<div className="flex flex-1 flex-col items-start gap-[3px]">
													<div className="flex items-center bg-[#28B87026] ml-[22px] rounded-md">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/sevj7tmm_expires_30_days.png"} 
															className="w-[27px] h-[27px] rounded-md object-fill"
														/>
														<span className="text-[#28B870] text-xs" >
															{"+6,53%"}
														</span>
													</div>
													<span className="text-[#7E7E7E] text-xs" >
														{"Kể từ năm ngoái"}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-1 flex-col bg-white p-3 mr-[11px] gap-1.5 rounded-[10px] border border-solid border-[#8C8C8C]">
											<div className="flex justify-center items-start self-stretch gap-[37px]">
												<span className="text-black text-sm" >
													{"Tổng số đơn"}
												</span>
												<span className="text-black text-sm" >
													{"2020-2022"}
												</span>
											</div>
											<div className="flex justify-between items-center self-stretch">
												<span className="text-black text-2xl font-bold" >
													{"265"}
												</span>
												<div className="flex flex-col shrink-0 items-start gap-[3px]">
													<div className="flex items-center bg-[#EE08081A] ml-[29px] rounded-md">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/pijpbfcq_expires_30_days.png"} 
															className="w-[27px] h-[27px] rounded-md object-fill"
														/>
														<span className="text-[#EE0808] text-xs" >
															{"-1,15%"}
														</span>
													</div>
													<span className="text-[#7E7E7E] text-xs" >
														{"Kể từ năm ngoái"}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-1 flex-col bg-white p-3 mr-2.5 gap-1.5 rounded-[10px] border border-solid border-[#8C8C8C]">
											<div className="flex items-start self-stretch gap-[11px]">
												<span className="text-black text-sm" >
													{"Tổng doanh thu"}
												</span>
												<span className="text-black text-sm" >
													{"2020-2022"}
												</span>
											</div>
											<div className="flex items-center self-stretch gap-[46px]">
												<span className="text-black text-2xl font-bold" >
													{"1,192"}
												</span>
												<div className="flex flex-1 flex-col items-start gap-[3px]">
													<div className="flex items-center bg-[#28B87026] ml-[22px] rounded-md">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/rn6bq0js_expires_30_days.png"} 
															className="w-[27px] h-[27px] rounded-md object-fill"
														/>
														<span className="text-[#28B870] text-xs" >
															{"+6,53%"}
														</span>
													</div>
													<span className="text-[#7E7E7E] text-xs" >
														{"Kể từ năm ngoái"}
													</span>
												</div>
											</div>
										</div>
										<div className="flex flex-1 flex-col bg-white p-3 gap-1.5 rounded-[10px] border border-solid border-[#8C8C8C]">
											<div className="flex items-start self-stretch gap-[7px]">
												<span className="text-black text-sm" >
													{"Tổng số truy cập"}
												</span>
												<span className="text-black text-sm" >
													{"2020-2022"}
												</span>
											</div>
											<div className="flex items-center self-stretch gap-[46px]">
												<span className="text-black text-2xl font-bold" >
													{"1,192"}
												</span>
												<div className="flex flex-1 flex-col items-start gap-[3px]">
													<div className="flex items-center bg-[#28B87026] ml-[25px] rounded-md">
														<img
															src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/9a9926q6_expires_30_days.png"} 
															className="w-[27px] h-[27px] rounded-md object-fill"
														/>
														<span className="text-[#28B870] text-xs" >
															{"+1,23%"}
														</span>
													</div>
													<span className="text-[#7E7E7E] text-xs" >
														{"Kể từ năm ngoái"}
													</span>
												</div>
											</div>
										</div>
									</div>
									<div className="flex flex-col self-stretch mb-[41px] gap-[18px]">
										<div className="flex justify-between items-center self-stretch py-[1px] px-3">
											<span className="text-gray-700 text-[13px] font-bold" >
												{"Thống kê bán hàng"}
											</span>
											<button className="flex shrink-0 items-center bg-[#F8F9FA] text-left py-1 px-[18px] gap-5 rounded border border-solid border-[#E4E7EB]"
												onClick={()=>alert("Pressed!")}>
												<span className="text-[#4A5462] text-sm" >
													{"Năm ngoái"}
												</span>
												<img
													src={"https://storage.googleapis.com/tagjs-prod.appspot.com/v1/P05VHaagEL/5gaevsz7_expires_30_days.png"} 
													className="w-6 h-6 rounded object-fill"
												/>
											</button>
										</div>
										<div className="self-stretch bg-white p-3">
											<div className="flex flex-col items-center self-stretch">
												<div className="flex items-start px-2 gap-2">
													<div className="flex shrink-0 items-start p-1 gap-1">
														<div className="shrink-0 items-start py-[7px] px-2">
															<div className="w-[1px] h-[1px]">
															</div>
															<div className="bg-[#8979FF] w-[1px] h-[1px]">
															</div>
														</div>
														<span className="text-black text-xs" >
															{"2020"}
														</span>
													</div>
													<div className="flex shrink-0 items-start p-1 gap-1">
														<div className="shrink-0 items-start py-[7px] px-2">
															<div className="w-[1px] h-[1px]">
															</div>
															<div className="bg-[#FF928A] w-[1px] h-[1px]">
															</div>
														</div>
														<span className="text-black text-xs" >
															{"2021"}
														</span>
													</div>
													<div className="flex shrink-0 items-start p-1 gap-1">
														<div className="shrink-0 items-start py-[7px] px-2">
															<div className="w-[1px] h-[1px]">
															</div>
															<div className="bg-[#3BC3DE] w-[1px] h-[1px]">
															</div>
														</div>
														<span className="text-black text-xs" >
															{"2022"}
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-start self-stretch pt-1.5 pb-[38px] px-1 gap-1.5">
												<div className="flex flex-col shrink-0 items-start">
													<span className="text-black text-xs mb-[66px]" >
														{"100"}
													</span>
													<span className="text-black text-xs mb-[66px] ml-1.5" >
														{"80"}
													</span>
													<span className="text-black text-xs mb-[66px] ml-1.5" >
														{"60"}
													</span>
													<span className="text-black text-xs mb-[66px] ml-[5px]" >
														{"40"}
													</span>
													<span className="text-black text-xs mb-[66px] ml-1.5" >
														{"20"}
													</span>
													<span className="text-black text-xs ml-[13px]" >
														{"0"}
													</span>
												</div>
												<div className="flex flex-1 flex-col gap-[5px]">
													<div className="flex items-start self-stretch">
														<div className="flex flex-1 justify-center items-start gap-0.5">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[246px]">
																<div className="bg-[#8979FF] w-4 h-[163px] mb-[1px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-11">
																<div className="bg-[#FF928A] w-4 h-[365px] mb-[1px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[285px]">
																<div className="bg-[#3BC3DE] w-4 h-[124px] mb-[1px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[111px] mr-0.5">
																<div className="bg-[#8979FF] w-4 h-[299px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[115px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[295px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[173px]">
																<div className="bg-[#3BC3DE] w-4 h-[237px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start relative pb-[1px] mr-0.5">
																<div className="bg-[#D6DBED66] w-4 h-[410px]">
																</div>
																<div className="self-stretch bg-[#8979FF] h-[232px] absolute bottom-0 right-0 left-0">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[129px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[281px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[282px]">
																<div className="bg-[#3BC3DE] w-4 h-[127px] mb-[1px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start mr-[1px]">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[93px] mr-[3px]">
																<div className="bg-[#8979FF] w-4 h-[317px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-7 mr-0.5">
																<div className="bg-[#FF928A] w-4 h-[382px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[183px]">
																<div className="bg-[#3BC3DE] w-4 h-[227px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start gap-0.5">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[164px]">
																<div className="bg-[#8979FF] w-4 h-[245px] mb-[1px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[167px]">
																<div className="bg-[#FF928A] w-4 h-[243px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[78px]">
																<div className="bg-[#3BC3DE] w-4 h-[332px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[103px] mr-0.5">
																<div className="bg-[#8979FF] w-4 h-[307px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[103px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[307px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[319px]">
																<div className="bg-[#3BC3DE] w-4 h-[91px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[191px] mr-0.5">
																<div className="bg-[#8979FF] w-4 h-[219px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[30px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[380px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[72px]">
																<div className="bg-[#3BC3DE] w-4 h-[338px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start mr-[1px]">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[261px] mr-[3px]">
																<div className="bg-[#8979FF] w-4 h-[149px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[105px] mr-0.5">
																<div className="bg-[#FF928A] w-4 h-[305px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[155px]">
																<div className="bg-[#3BC3DE] w-4 h-[255px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start gap-0.5">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[207px]">
																<div className="bg-[#8979FF] w-4 h-[202px] mb-[1px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[364px]">
																<div className="bg-[#FF928A] w-4 h-[46px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[244px]">
																<div className="bg-[#3BC3DE] w-4 h-[165px] mb-[1px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[69px] mr-0.5">
																<div className="bg-[#8979FF] w-4 h-[341px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[55px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[355px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[285px]">
																<div className="bg-[#3BC3DE] w-4 h-[125px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[135px] mr-0.5">
																<div className="bg-[#8979FF] w-4 h-[275px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[321px] mr-[3px]">
																<div className="bg-[#FF928A] w-4 h-[89px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[105px]">
																<div className="bg-[#3BC3DE] w-4 h-[305px]">
																</div>
															</div>
														</div>
														<div className="flex flex-1 justify-center items-start">
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[23px] mr-[3px]">
																<div className="bg-[#8979FF] w-4 h-[387px]">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[354px] mr-0.5">
																<div className="bg-[#FF928A] w-4 h-14">
																</div>
															</div>
															<div className="shrink-0 items-start bg-[#D6DBED66] pt-[196px]">
																<div className="bg-[#3BC3DE] w-4 h-[214px]">
																</div>
															</div>
														</div>
													</div>
													<div className="flex items-start self-stretch ml-[17px] mr-[35px]">
														<span className="flex-1 text-black text-xs text-right mr-[52px]" >
															{"Jan"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[51px]" >
															{"Feb"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[52px]" >
															{"Mar"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[47px]" >
															{"Apr"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[50px]" >
															{"May"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[55px]" >
															{"Jun"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[51px]" >
															{"Jul"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[49px]" >
															{"Aug"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[49px]" >
															{"Sep"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[50px]" >
															{"Oct"}
														</span>
														<span className="flex-1 text-black text-xs text-right mr-[50px]" >
															{"Nov"}
														</span>
														<span className="flex-1 text-black text-xs text-right" >
															{"Dec"}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}